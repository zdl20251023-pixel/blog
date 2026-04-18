- 整体和发送给ai的数据结构类似
- 增加了result字段，记录了亮牌的数据，最后身上筹码

```json
{
  "gameuuid": "card_26689556754448389",
  "players": [
    {
      "id": 9,
      "seat_no": 0,
      "stack": 1000,
      "name": "Rui Cao",
      "hold_cards": "Tc5c"
    },
    {
      "id": 10,
      "seat_no": 1,
      "stack": 1000,
      "name": "Danny Tang",
      "hold_cards": "Kc6c"
    },
    {
      "id": 11,
      "seat_no": 2,
      "stack": 1000,
      "name": "Elton Tsang",
      "hold_cards": "As9d"
    },
    {
      "id": 12,
      "seat_no": 3,
      "stack": 1000,
      "name": "Phil Ivey",
      "hold_cards": "5sQd"
    },
    {
      "id": 13,
      "seat_no": 4,
      "stack": 1000,
      "name": "St Wang",
      "hold_cards": "9cQh"
    },
    {
      "id": 14,
      "seat_no": 5,
      "stack": 1000,
      "name": "Jungleman",
      "hold_cards": "2hQs"
    }
  ],
  "big_blind": 10,
  "ante": 5,
  "dealer_seat": 5,
  "sb_seat": 0,
  "bb_seat": 1,
  "roomid": "table_26689556230160389",
  "straddle_seat": -1,
  "actions": [
    {
      "action": "raise",
      "seat_no": 2,
      "amount": 30
    },
    {
      "action": "fold",
      "seat_no": 3,
      "amount": 0
    },
    {
      "action": "call",
      "seat_no": 4,
      "amount": 30
    },
    {
      "action": "fold",
      "seat_no": 5,
      "amount": 0
    },
    {
      "action": "call",
      "seat_no": 0,
      "amount": 30
    },
    {
      "action": "call",
      "seat_no": 1,
      "amount": 30
    },
    {
      "action": "4cAcQc",
      "seat_no": -1,
      "amount": 0
    },
    {
      "action": "check",
      "seat_no": 0,
      "amount": 0
    },
    {
      "action": "check",
      "seat_no": 1,
      "amount": 0
    },
    {
      "action": "check",
      "seat_no": 2,
      "amount": 0
    },
    {
      "action": "check",
      "seat_no": 4,
      "amount": 0
    },
    {
      "action": "5d",
      "seat_no": -1,
      "amount": 0
    },
    {
      "action": "check",
      "seat_no": 0,
      "amount": 0
    },
    {
      "action": "check",
      "seat_no": 1,
      "amount": 0
    },
    {
      "action": "bet",
      "seat_no": 2,
      "amount": 35
    },
    {
      "action": "call",
      "seat_no": 4,
      "amount": 35
    },
    {
      "action": "raise",
      "seat_no": 0,
      "amount": 290
    },
    {
      "action": "call",
      "seat_no": 1,
      "amount": 290
    },
    {
      "action": "fold",
      "seat_no": 2,
      "amount": 0
    },
    {
      "action": "fold",
      "seat_no": 4,
      "amount": 0
    },
    {
      "action": "6d",
      "seat_no": -1,
      "amount": 0
    },
    {
      "action": "bet",
      "seat_no": 0,
      "amount": 540
    },
    {
      "action": "allin",
      "seat_no": 1,
      "amount": 675
    },
    {
      "action": "call",
      "seat_no": 0,
      "amount": 675
    }
  ],
  "result": {
    "players": [
      {
        "seat_no": 0,
        "stack": 0,
        "hold_cards": "Tc5c"
      },
      {
        "seat_no": 1,
        "stack": 2150,
        "hold_cards": "Kc6c"
      },
      {
        "seat_no": 2,
        "stack": 930,
        "hold_cards": ""
      },
      {
        "seat_no": 3,
        "stack": 995,
        "hold_cards": ""
      },
      {
        "seat_no": 4,
        "stack": 930,
        "hold_cards": ""
      },
      {
        "seat_no": 5,
        "stack": 995,
        "hold_cards": ""
      }
    ]
  }
}
```
