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
};

export type SetPvProps = {
  action_label: string;
  modifyNumber?: (current: number) => number;
  set_pv?: string;
} & ReadPvProps;

export type PvItem = { label: string; value: PvDTypeUnion };
export type ReadPvComponentProps = ReadPvProps & { render: PvItemComponent };
export type PvItemComponent = ({ label, value }: PvItem) => JSX.Element;

export function parseResult(value: string, dType: PvDTypes, sigFigs?: number) {
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
