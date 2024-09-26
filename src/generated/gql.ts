// deno-lint-ignore-file
import { GraphQLResolveInfo } from "graphql";
import { GraphqlContext } from "../context.ts";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> =
  & Omit<T, K>
  & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> =
  & Omit<T, K>
  & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> =
  & Omit<T, K>
  & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Detection = {
  __typename?: "Detection";
  type_id: Scalars["ID"];
  type_name: Scalars["String"];
};

export type DetectionSaveRecordDataInput = {
  detection?: InputMaybe<SaveRecordDetectionInput>;
  types: Array<DetectionSaveRecordType>;
};

export enum DetectionSaveRecordType {
  IQ_DATA_DETECTIONS = "IQ_DATA_DETECTIONS",
  IQ_DATA_NO_DETECTIONS = "IQ_DATA_NO_DETECTIONS",
  PINK_MATRIX_DETECTIONS = "PINK_MATRIX_DETECTIONS",
  PINK_MATRIX_NO_DETECTIONS = "PINK_MATRIX_NO_DETECTIONS",
}

export type Mutation = {
  __typename?: "Mutation";
  start_detection: Scalars["Boolean"];
  stop_detection: Scalars["Boolean"];
};

export type MutationStart_DetectionArgs = {
  save_record_data: DetectionSaveRecordDataInput;
};

export type Query = {
  __typename?: "Query";
  authorized: Scalars["Boolean"];
  test: Scalars["Boolean"];
};

export type SaveRecordDetectionInput = {
  threat_type_ids: Array<Scalars["ID"]>;
};

export enum Status {
  IDLE = "IDLE",
  RUNNING = "RUNNING",
}

export type Subscription = {
  __typename?: "Subscription";
  detections: Array<Detection>;
  status: Status;
  test: Scalars["Int"];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
    ...args: any[]
  ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Detection: ResolverTypeWrapper<Detection>;
  DetectionSaveRecordDataInput: DetectionSaveRecordDataInput;
  DetectionSaveRecordType: DetectionSaveRecordType;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  SaveRecordDetectionInput: SaveRecordDetectionInput;
  Status: Status;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Subscription: ResolverTypeWrapper<{}>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars["Boolean"];
  Detection: Detection;
  DetectionSaveRecordDataInput: DetectionSaveRecordDataInput;
  ID: Scalars["ID"];
  Int: Scalars["Int"];
  Mutation: {};
  Query: {};
  SaveRecordDetectionInput: SaveRecordDetectionInput;
  String: Scalars["String"];
  Subscription: {};
}>;

export type DetectionResolvers<
  ContextType = GraphqlContext,
  ParentType extends ResolversParentTypes["Detection"] =
    ResolversParentTypes["Detection"],
> = ResolversObject<{
  type_id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  type_name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = GraphqlContext,
  ParentType extends ResolversParentTypes["Mutation"] =
    ResolversParentTypes["Mutation"],
> = ResolversObject<{
  start_detection?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<MutationStart_DetectionArgs, "save_record_data">
  >;
  stop_detection?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = GraphqlContext,
  ParentType extends ResolversParentTypes["Query"] =
    ResolversParentTypes["Query"],
> = ResolversObject<{
  authorized?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  test?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
}>;

export type SubscriptionResolvers<
  ContextType = GraphqlContext,
  ParentType extends ResolversParentTypes["Subscription"] =
    ResolversParentTypes["Subscription"],
> = ResolversObject<{
  detections?: SubscriptionResolver<
    Array<ResolversTypes["Detection"]>,
    "detections",
    ParentType,
    ContextType
  >;
  status?: SubscriptionResolver<
    ResolversTypes["Status"],
    "status",
    ParentType,
    ContextType
  >;
  test?: SubscriptionResolver<
    ResolversTypes["Int"],
    "test",
    ParentType,
    ContextType
  >;
}>;

export type Resolvers<ContextType = GraphqlContext> = ResolversObject<{
  Detection?: DetectionResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
}>;
