import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve agenda item by id.
 *
 * @param getAgendaItemId - The ID of the item which is being retrieved.
 * @returns Agenda item associated with the id.
 */

export const GET_AGENDA_ITEM = gql`
  query GetAgendaItem($getAgendaItemId: ID!) {
    getAgendaItem(id: $getAgendaItemId) {
      _id
    }
  }
`;
