import * as T from "@effect-ts/core/Effect"
import { pipe } from "@effect-ts/core/Function"

import * as TaskContext from "./TaskContext"

import { Request, Response } from "@effect-ts-demo/todo-client/Tasks/SetTasksOrder"

export const handle = (_: Request) => pipe(TaskContext.setOrder(_.order), T.asUnit)

export { Request, Response }
