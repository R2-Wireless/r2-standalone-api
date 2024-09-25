export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  test: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  start_detection: Scalars['Boolean'];
  stop_detection: Scalars['Boolean'];
};


export type MutationStart_DetectionArgs = {
  save_record_data: DetectionSaveRecordDataInput;
};

export type Subscription = {
  __typename?: 'Subscription';
  test: Scalars['Int'];
  detections: Array<Detection>;
  status: Status;
};

export enum Status {
  Idle = 'IDLE',
  Running = 'RUNNING'
}

export enum DetectionSaveRecordType {
  IqDataDetections = 'IQ_DATA_DETECTIONS',
  IqDataNoDetections = 'IQ_DATA_NO_DETECTIONS',
  PinkMatrixDetections = 'PINK_MATRIX_DETECTIONS',
  PinkMatrixNoDetections = 'PINK_MATRIX_NO_DETECTIONS'
}

export type DetectionSaveRecordDataInput = {
  types: Array<DetectionSaveRecordType>;
  detection?: InputMaybe<SaveRecordDetectionInput>;
};

export type SaveRecordDetectionInput = {
  threat_type_ids: Array<Scalars['ID']>;
};

export type Detection = {
  __typename?: 'Detection';
  type_id: Scalars['ID'];
  type_name: Scalars['String'];
};
