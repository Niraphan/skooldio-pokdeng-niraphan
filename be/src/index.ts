import { Elysia, t } from "elysia";
import { createGame, actionInGame } from "./services/game.service";
import { UserAction } from "./models/game.model";

const app = new Elysia()

.post(
  "/game/start",
  ({ body }) => {
    const result = createGame(body.initial_balance);
    return result;
  },
  {
    body: t.Object({
      initial_balance: t.Number({
        minimum: 1,
      }),
    }),
  }
)
.post(
  "/game/:game_id/action",
  ({ params, body }) => {
    const result = actionInGame(params.game_id, body.action as UserAction, body.amount || 0);
    return result;
  },
  {
    params: t.Object({
      game_id: t.String(),
    }),
    body: t.Object({
      action: t.String(),
      amount: t.Optional(t.Number()),
    }),
  }
)

.listen(3000);

console.log("Server running");