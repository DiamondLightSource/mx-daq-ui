import { gql } from "@apollo/client";

export enum PvDTypes {
  Float,
  Int,
  String,
}
export type PvDTypeUnion = number | string;

export const GET_PV_QUERY = gql`
  query ReadPv($id: ID!) {
    getChannel(id: $id) {
      value {
        string
      }
    }
  }
`;

export const SET_PV_QUERY = gql`
  mutation SetPv($ids: [ID!]!, $values: [String!]!) {
    putChannels(ids: $ids, values: $values) {
      value {
        string
      }
    }
  }
`;

export type ReadPvProps = {
  pv: string;
  label: string;
  pollInterval?: number;
  sigFigs?: number;
  dType?: PvDTypes;
  preTransformValue?: (value: string) => string;
};

export type SetPvProps = {
  action_label: string;
  modifyNumber?: (current: number) => number;
  set_pv?: string;
} & ReadPvProps;

export type PvItem = { label: string; value: PvDTypeUnion };
export type PvItemComponent = ({ label, value }: PvItem) => JSX.Element;
export type ReadPvComponentProps = ReadPvProps & { render: PvItemComponent };

export function parseResult(
  value: string,
  dType: PvDTypes,
  sigFigs?: number,
  preTransformValue?: (value: string) => string
) {
  if (preTransformValue) {
    value = preTransformValue(value);
  }
  switch (dType) {
    case PvDTypes.Float: {
      return sigFigs ? parseFloat(value).toFixed(sigFigs) : parseFloat(value);
    }
    case PvDTypes.Int: {
      return parseInt(value);
    }
    case PvDTypes.String: {
      return value;
    }
  }
}

type StringMapping = Record<string, string>;
export function makeStringTransform(map: StringMapping) {
  return (value: string) => {
    if (value in map) {
      return map[value];
    }
    return "Unknown";
  };
}
