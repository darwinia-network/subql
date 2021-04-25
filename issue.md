Hi Jaco

I have some problems in a project that depend on polkadot-js api, seems that it may be types issue, but I am not confirmed. Could you please take a look at it?

Below is the error log:

> subquery-node_1   | 2021-04-25T02:43:33.042Z <indexer> ERROR failed to fetch block Error: createType(SignedBlock):: Struct: failed on block: {"header":"Header","extrinsics":"Vec<Extrinsic>"}:: Struct: failed on extrinsics: Vec<Extrinsic>:: createType(ExtrinsicV4):: createType(ExtrinsicSignatureV4):: Unable to create Enum via index 73, in Ed25519, Sr25519, Ecdsa

As the log display, I have checked the SignedBlock type between polkadot-js api dependance ot the project version and the actual types we provided.

> polkadot-js (version: 4.5.1) dependance SignedBlock

```ts
export interface SignedBlock extends SignedBlockWithJustifications {
}

export interface SignedBlockWithJustifications extends Struct {
    readonly block: Block;
    readonly justifications: Option<Justifications>;
}

export interface Justifications extends Vec<Justification> {
}

export interface Justification extends ITuple<[ConsensusEngineId, EncodedJustification]> {
}

export interface ConsensusEngineId extends GenericConsensusEngineId {
}

export interface EncodedJustification extends Bytes {
}
```

> Provided (polkadot-js api version: 3.6.4) SignedBlock

```ts
export interface SignedBlock extends Struct {
    readonly block: Block;
    readonly justification: Justification;
}

export interface Justification extends Bytes {
}
```

so I tried to patch provided version to consist with the dependance version, something like this:

```yaml
...
    SignedBlock: SignedBlockWithJustifications
    SignedBlockWithJustifications: 
        block: Block
        justifications: Option<Justifications>
    Justifications: Vec<Justification>
    Justification: (ConsensusEngineId, EncodedJustification)
    EncodedJustification: Bytes
...
```

Unfortunately, the error still exists, SignedBlock type error seems not fixed. So, I have no idea how to fix this issue.
