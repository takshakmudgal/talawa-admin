import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve agenda item by id.
 *
 * @param getAgendaItemId - The ID of the item which is being retrieved.
 * @returns Agenda item associated with the id.
 */

export const AGENDA_ITEM_LIST = gql`
  query GetAgendaItem($getAgendaItemId: ID!) {
    getAgendaItem(id: $getAgendaItemId) {
      _id
    }
  }
`;

export const GET_ALL_AGENDA_ITEMS = gql`
  query GetAllAgendaItems {
    getAllAgendaItems {
      _id
    }
  }
`;
