import type { Request } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";

/**
 * Request with only body
 */
export interface IBodyRequest<TBody> extends Request<ParamsDictionary, unknown, TBody, ParsedQs> {
  body: TBody;
}

/**
 * Request with only params
 */
export interface IParamsRequest<TParams> extends Request<TParams & ParamsDictionary, unknown, unknown, ParsedQs> {
  params: TParams & ParamsDictionary;
}

/**
 * Request with only query
 */
export interface IQueryRequest<TQuery> extends Request<ParamsDictionary, unknown, unknown, TQuery & ParsedQs> {
  query: TQuery & ParsedQs;
}

/**
 * Combined request: body + params + query
 */
export interface ICombinedRequest<
  TBody = Record<string, unknown>,
  TParams = Record<string, unknown>,
  TQuery = Record<string, unknown>,
> extends Request<TParams & ParamsDictionary, unknown, TBody, TQuery & ParsedQs> {
  body: TBody;
  params: TParams & ParamsDictionary;
  query: TQuery & ParsedQs;
}
