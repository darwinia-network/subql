# Announcement

## Accounts query

You can get the three accounts with the most sent transactions as below

```sql

query {
  accounts(orderBy: TRANSFER_TOTAL_COUNT_DESC, offset: 0, first: 3) {
    nodes {
      id
      transferTotalCount
      transferIn {
        totalCount
      }
      transferOut {
        totalCount
      }
    }
  }
}
```

If you execute this query in playground, the result looks like this (depend on the chain data):

```json
{
  "data": {
    "query": {
      "accounts": {
        "nodes": [
          {
            "id": "2rGH1BB1E6fvTqiVrHMwNw8r5VrFYznvafn2Uf7amvYdCZ9f",
            "transferTotalCount": 3,
            "transferIn": {
              "totalCount": 0
            },
            "transferOut": {
              "totalCount": 3
            }
          },
          {
            "id": "2qSbd2umtD4KmV2X4zZk5QkCvmYKyiR2ysAeM1Eca6vcvg7N",
            "transferTotalCount": 2,
            "transferIn": {
              "totalCount": 2
            },
            "transferOut": {
              "totalCount": 0
            }
          },
          {
            "id": "2qm1cqjdZH2Kp6HBHGFL8RC4coWD8hv4nPgdBVvs3tVaLp1S",
            "transferTotalCount": 2,
            "transferIn": {
              "totalCount": 0
            },
            "transferOut": {
              "totalCount": 2
            }
          }
        ]
      }
    }
  }
}
```

## Transfer of specific account

You can get all of the transaction records of a specific account. The query below indicates that we need to get all the sent or received records with the address 2rGH1BB1E6fvTqiVrHMwNw8r5VrFYznvafn2Uf7amvYdCZ9f. This query also includes pagination information, offset 0 indicates skip 0 records in the result and last 20 indicate that the query should return the newest 20 records.

```sql
  query {
    transfers(
      last:20,
      offset:0
      filter: {
        or: [
          { fromId: { equalTo: "2rGH1BB1E6fvTqiVrHMwNw8r5VrFYznvafn2Uf7amvYdCZ9f" } },
          { toId: { equalTo: "2rGH1BB1E6fvTqiVrHMwNw8r5VrFYznvafn2Uf7amvYdCZ9f" } }
        ]
      }
      orderBy: TIMESTAMP_DESC
    ) {
      totalCount
      nodes {
        toId
        fromId
        amount
        timestamp
        tokenId
        fee
        blockNumber
        blockId
      }
    }
  }
```

The result looks like below

```json
{
  "data": {
    "query": {
      "transfers": {
        "totalCount": 3,
        "nodes": [
          {
            "toId": "2qeMxq616BhqvTW8w37h53EpGmDWyUFpiYDmE4sD4mkKdcqh",
            "fromId": "2rGH1BB1E6fvTqiVrHMwNw8r5VrFYznvafn2Uf7amvYdCZ9f",
            "amount": "50000000000",
            "timestamp": "2021-05-23T04:34:42",
            "tokenId": "balances",
            "fee": "107260685",
            "blockNumber": "40133",
            "blockId": "0x11052e8f60e3ef4bbdaf03f19232433040b5bb842897fa4c9eeeefd87c44621e"
          },
          {
            "toId": "2qSbd2umtD4KmV2X4zZk5QkCvmYKyiR2ysAeM1Eca6vcvg7N",
            "fromId": "2rGH1BB1E6fvTqiVrHMwNw8r5VrFYznvafn2Uf7amvYdCZ9f",
            "amount": "2100000000",
            "timestamp": "2021-05-20T04:18:53.999",
            "tokenId": "kton",
            "fee": "260853859",
            "blockNumber": "5027",
            "blockId": "0xbb4d1812dd26cfcbcff3fc42db80b823f88a1b3b9bc3d10b9932b0c6dd748a97"
          },
          {
            "toId": "2qSbd2umtD4KmV2X4zZk5QkCvmYKyiR2ysAeM1Eca6vcvg7N",
            "fromId": "2rGH1BB1E6fvTqiVrHMwNw8r5VrFYznvafn2Uf7amvYdCZ9f",
            "amount": "99000000000",
            "timestamp": "2021-05-20T04:18:17.999",
            "tokenId": "balances",
            "fee": "260867445",
            "blockNumber": "5024",
            "blockId": "0xd73bcb4952528e6834f7226abc0035365c0e1a496b52c8d2a11f0efe60277a51"
          }
        ]
      }
    }
  }
}
```
