import { EditableTaskProps } from "@effect-ts-demo/todo-types"
import { Void } from "@effect-ts-demo/todo-types/shared"
import { make, AType, EType, opaque } from "@effect-ts/morphic"

const Request_ = make((F) =>
  F.both(
    {
      id: F.uuid(),
    },
    EditableTaskProps(F)
  )
)
export interface Request extends AType<typeof Request_> {}
export interface RequestE extends EType<typeof Request_> {}
export const Request = opaque<RequestE, Request>()(Request_)

export const Response = Void
export type Response = AType<typeof Response>
export type ResponseE = EType<typeof Response>
