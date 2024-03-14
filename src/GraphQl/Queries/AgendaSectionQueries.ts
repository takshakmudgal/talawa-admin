import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve agenda section by id.
 *
 * @param getAgendaSectionId - The ID of the section which is being retrieved.
 * @returns Agenda section associated with the id.
 */

export const GET_AGENDA_SECTION = gql`
  query GetAgendaSection($getAgendaSectionId: ID!) {
    getAgendaSection(id: $getAgendaSectionId) {
      _id
    }
  }
`;
