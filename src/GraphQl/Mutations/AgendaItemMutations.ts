import gql from 'graphql-tag';

/**
 * GraphQL mutation to create an agenda item.
 *
 * @param input - Attachments, Categories, Description, Duration, IsNote, ItemType, OrganizationID, RelatedEventID, Sequence, Title, Urls, User of the AgendaItem.
 */

export const CREATE_AGENDA_ITEM_MUTATION = gql`
  mutation CreateAgendaItem($input: CreateAgendaItemInput!) {
    createAgendaItem(input: $input) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to remove an agenda item.
 *
 * @param removeAgentItemId - ID of the AgendaItem to be removed.
 */

export const REMOVE_AGENDA_ITEM_MUTATION = gql`
  mutation RemoveAgendaItem($removeAgendaItemId: ID!) {
    removeAgendaItem(id: $removeAgendaItemId) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to update an agenda item.
 *
 * @param updateAgendaItemId - ID of the AgendaItem to be updated.
 * @param input - Attachments, Categories, Description, Duration, IsNote, ItemType, OrganizationID, RelatedEventID, Sequence, Title, Urls, User of the AgendaItem, which can be updated.
 */

export const UPDATE_AGENDA_ITEM_MUTATION = gql`
  mutation UpdateAgendaItem(
    $updateAgendaItemId: ID!
    $input: UpdateAgendaItemInput!
  ) {
    updateAgendaItem(id: $updateAgendaItemId, input: $input) {
      _id
    }
  }
`;
