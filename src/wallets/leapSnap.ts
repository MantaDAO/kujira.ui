import { Decimal } from "@cosmjs/math";
import { AccountData, EncodeObject } from "@cosmjs/proto-signing";
import {
  DeliverTxResponse,
  GasPrice,
  SigningStargateClient,
} from "@cosmjs/stargate";
import { ChainInfo } from "@keplr-wallet/types";
import {
  CosmjsOfflineSigner,
  connectSnap,
  getKey,
  getSnap,
  suggestChain,
} from "@leapwallet/cosmos-snap-provider";
import { accountParser, aminoTypes, registry } from "kujira.js";

type Options = { feeDenom: string };

export class LeapSnap {
  private constructor(
    public account: AccountData,
    private config: ChainInfo,
    private options?: Options
  ) {}

  public static async connect(
    config: ChainInfo,
    opts?: { feeDenom: string }
  ): Promise<LeapSnap> {
    const snapInstalled = await getSnap();
    if (!snapInstalled) {
      await connectSnap(); // Initiates installation if not already present
    }

    try {
      const account = await getKey(config.chainId);
      return new LeapSnap(account, config, opts);
    } catch (error: any) {
      if (error.message === "Invalid chainId") {
        await suggestChain(config);
        return LeapSnap.connect(config, opts);
      }
      throw error;
    }
  }
  public onChange = (fn: (k: LeapSnap | null) => void) => {};

  public disconnect = () => {};

  signAndBroadcast = async (
    rpc: string,
    encodeObjects: EncodeObject[]
  ): Promise<DeliverTxResponse> => {
    const signer = new CosmjsOfflineSigner(this.config.chainId);

    const gasPrice = new GasPrice(
      Decimal.fromUserInput("0.00125", 18),
      this.options
        ? this.options.feeDenom
        : this.config.feeCurrencies[0].coinDenom
    );

    const client = await SigningStargateClient.connectWithSigner(
      rpc,
      signer,
      {
        registry,
        gasPrice,
        aminoTypes: aminoTypes(
          this.config.bech32Config.bech32PrefixAccAddr
        ),
        accountParser,
      }
    );

    return await client.signAndBroadcast(
      this.account.address,
      encodeObjects,
      1.5
    );
  };
}
