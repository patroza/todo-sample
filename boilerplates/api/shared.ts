import { flow } from "@effect-ts-app/core/ext/Function"
import * as S from "@effect-ts-app/core/ext/Schema"
import * as T from "@effect-ts/core/Effect"
import { SchemaAny } from "@effect-ts/schema"

import { UnauthorizedError, NotFoundError } from "@/errors"

// TODO: move to effect-ts-app/infra ?

export function handle<
  TModule extends Record<
    string,
    { Model: SchemaAny; new (...args: any[]): any } | SchemaAny
  >,
  TRes extends { Model: SchemaAny } | SchemaAny = typeof S.Void
>(
  _: TModule & { Response?: TRes }
): <R, E>(
  h: (
    r: InstanceType<
      S.GetRequest<TModule> extends { new (...args: any[]): any }
        ? S.GetRequest<TModule>
        : never
    >
  ) => T.Effect<R, E, S.ParsedShapeOf<Extr<TRes>>>
) => {
  h: typeof h
  Request: S.GetRequest<TModule>
  Response: TRes
} {
  // TODO: Prevent over providing // no strict/shrink yet.
  const Request = S.extractRequest(_)

  return <R, E>(
    h: (
      r: InstanceType<
        S.GetRequest<TModule> extends { new (...args: any[]): any }
          ? S.GetRequest<TModule>
          : never
      >
    ) => T.Effect<R, E, S.ParsedShapeOf<Extr<TRes>>>
  ) => ({ h, Request, Response: (_.Response ?? S.Void) as TRes } as any)
}

type Extr<T> = T extends { Model: SchemaAny }
  ? T["Model"]
  : T extends SchemaAny
  ? T
  : never

export function authorizeM_<T, UserId, Err>(
  canAccess: (rsc: T, userId: UserId) => boolean,
  bad: (rsc: T, userId: UserId) => Err
) {
  return <R, E, A>(
    rsc: T,
    userId: UserId,
    ok: (rsc: T) => T.Effect<R, E, A>
  ): T.Effect<R, E | Err, A> => {
    if (canAccess(rsc, userId)) {
      return ok(rsc)
    }
    return T.fail(bad(rsc, userId))
  }
}

export function authorize_<T, UserId, Err>(
  canAccess: (rsc: T, userId: UserId) => boolean,
  bad: (rsc: T, userId: UserId) => Err
) {
  const auth = authorizeM_(canAccess, bad)
  return <A>(rsc: T, userId: UserId, ok: (rsc: T) => A) =>
    auth(rsc, userId, flow(ok, T.succeed))
}

export function authorizeM<T, UserId, Err>(
  canAccess: (rsc: T, userId: UserId) => boolean,
  bad: (rsc: T, userId: UserId) => Err
) {
  return <R, E, A>(userId: UserId, ok: (rsc: T) => T.Effect<R, E, A>) =>
    (rsc: T): T.Effect<R, E | Err, A> => {
      if (canAccess(rsc, userId)) {
        return ok(rsc)
      }
      return T.fail(bad(rsc, userId))
    }
}

export function authorize<T, UserId, Err>(
  canAccess: (rsc: T, userId: UserId) => boolean,
  bad: (rsc: T, userId: UserId) => Err
) {
  const auth = authorizeM(canAccess, bad)
  return <A>(userId: UserId, ok: (rsc: T) => A) => auth(userId, flow(ok, T.succeed))
}

export function makeAuthorize<T, UserId>(
  canAccess: (rsc: T, userId: UserId) => boolean,
  type: string,
  getId: (t: T) => string | number
) {
  return {
    authorize_: authorize_(canAccess, () => new UnauthorizedError()),
    authorize: authorize(canAccess, () => new UnauthorizedError()),
    authorizeM_: authorizeM_(canAccess, () => new UnauthorizedError()),
    authorizeM: authorizeM(canAccess, () => new UnauthorizedError()),

    hide_: authorize_(canAccess, (r) => new NotFoundError(type, getId(r).toString())),
    hide: authorize(canAccess, (r) => new NotFoundError(type, getId(r).toString())),
    hideM_: authorizeM_(canAccess, (r) => new NotFoundError(type, getId(r).toString())),
    hideM: authorizeM(canAccess, (r) => new NotFoundError(type, getId(r).toString())),
  }
}
