import gql from 'graphql-tag';

/**
 * GraphQL mutation to create an agenda section.
 *
 * @param input - Description, Items, RelatedEvent, Sequence of the AgendaSection.
 */

export const CREATE_AGENDA_SECTION_MUTATION = gql`
  mutation CreateAgendaSection($input: CreateAgendaSectionInput!) {
    createAgendaSection(input: $input) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to remove an agenda section.
 *
 * @param removeAgendaSectionId - ID of the AgendaSection to be removed.
 */

export const REMOVE_AGENDA_SECTION_MUTATION = gql`
  mutation RemoveAgendaSection($removeAgendaSectionId: ID!) {
    removeAgendaSection(id: $removeAgendaSectionId)
  }
`;

/**
 * GraphQL mutation to update an agenda section.
 *
 * @param updateAgendaSectionId - ID of the AgendaSection to be updated.
 * @param input - Description, Items, RelatedEvent, Sequence of the AgendaSection, which can be updated.
 */

export const UPDATE_AGENDA_SECTION_MUTATION = gql`
  mutation UpdateAgendaSection(
    $updateAgendaSectionId: ID!
    $input: UpdateAgendaSectionInput!
  ) {
    updateAgendaSection(id: $updateAgendaSectionId, input: $input) {
      _id
    }
  }
`;
