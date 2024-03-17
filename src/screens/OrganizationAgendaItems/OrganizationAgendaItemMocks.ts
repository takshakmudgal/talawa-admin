import { CREATE_AGENDA_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';

import {
  AGENDA_ITEM_CATEGORY_LIST,
  AGENDA_ITEM_LIST,
  MEMBERS_LIST,
} from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: { organizationId: '123' },
    },
    result: {
      data: {
        agendaCategory: [
          {
            _id: 'agendaItemCategory1',
            name: 'AgendaItemCategory 1',
            isDisabled: false,
          },
        ],
      },
    },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: { id: '123' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '123',
            members: [
              {
                _id: 'user1',
                firstName: 'Harve',
                lastName: 'Lance',
                email: 'harve@example.com',
                image: '',
                organizationsBlockedBy: [],
                createdAt: '2024-02-14',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: AGENDA_ITEM_LIST,
      variables: {
        organizationId: '123',
        orderBy: 'createdAt_DESC',
        agendaItemCategoryId: '',
        isActive: false,
        isCompleted: false,
      },
    },
    result: {
      data: {
        agendaItemsByOrganization: [
          {
            _id: 'agendaItem1',
            assignee: {
              _id: 'user1',
              firstName: 'Harve',
              lastName: 'Lance',
            },
            agendaItemCategory: {
              _id: 'agendaItemCategory1',
              name: 'AgendaItemCategory 1',
            },
            preCompletionNotes: 'Pre Completion Notes',
            postCompletionNotes: 'Post Completion Notes',
            assignmentDate: '2024-02-14',
            dueDate: '2024-02-21',
            completionDate: '2024-02-21',
            isCompleted: false,
            assigner: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: {
              _id: 'event1',
              title: 'event 1',
            },
            creator: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: AGENDA_ITEM_LIST,
      variables: {
        organizationId: '123',
        eventId: 'event1',
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        agendaItemsByOrganization: [
          {
            _id: 'agendaItem1',
            assignee: {
              _id: 'user1',
              firstName: 'Harve',
              lastName: 'Lance',
            },
            agendaItemCategory: {
              _id: 'agendaItemCategory1',
              name: 'AgendaItemCategory 1',
            },
            preCompletionNotes: 'Pre Completion Notes',
            postCompletionNotes: 'Post Completion Notes',
            assignmentDate: '2024-02-14',
            dueDate: '2024-02-21',
            completionDate: '2024-02-21',
            isCompleted: false,
            assigner: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: {
              _id: 'event1',
              title: 'event 1',
            },
            creator: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: AGENDA_ITEM_LIST,
      variables: {
        organizationId: '123',
        orderBy: 'createdAt_ASC',
        agendaItemCategoryId: '',
        isActive: false,
        isCompleted: false,
      },
    },
    result: {
      data: {
        agendaItemsByOrganization: [
          {
            _id: 'agendaItem3',
            assignee: {
              _id: 'user1',
              firstName: 'Praise',
              lastName: 'Norris',
            },
            agendaItemCategory: {
              _id: 'agendaItemCategory3',
              name: 'AgendaItemCategory 3',
            },
            preCompletionNotes: 'Pre Completion Notes',
            postCompletionNotes: 'Post Completion Notes',
            assignmentDate: '2024-02-14',
            dueDate: '2024-02-21',
            completionDate: '2024-02-21',
            isCompleted: false,
            assigner: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: {
              _id: 'event1',
              title: 'event 1',
            },
            creator: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: AGENDA_ITEM_LIST,
      variables: {
        organizationId: '123',
        orderBy: 'createdAt_ASC',
        agendaItemCategoryId: '',
        isActive: true,
        isCompleted: false,
      },
    },
    result: {
      data: {
        agendaItemsByOrganization: [
          {
            _id: 'agendaItem1',
            assignee: {
              _id: 'user1',
              firstName: 'Harve',
              lastName: 'Lance',
            },
            agendaItemCategory: {
              _id: 'agendaItemCategory1',
              name: 'AgendaItemCategory 1',
            },
            preCompletionNotes: 'Pre Completion Notes',
            postCompletionNotes: 'Post Completion Notes',
            assignmentDate: '2024-02-14',
            dueDate: '2024-02-21',
            completionDate: '2024-02-21',
            isCompleted: true,
            assigner: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: {
              _id: 'event1',
              title: 'event 1',
            },
            creator: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: AGENDA_ITEM_LIST,
      variables: {
        organizationId: '123',
        orderBy: 'createdAt_ASC',
        agendaItemCategoryId: '',
        isActive: false,
        isCompleted: true,
      },
    },
    result: {
      data: {
        agendaItemsByOrganization: [
          {
            _id: 'agendaItem1',
            assignee: {
              _id: 'user1',
              firstName: 'Harve',
              lastName: 'Lance',
            },
            agendaItemCategory: {
              _id: 'agendaItemCategory1',
              name: 'AgendaItemCategory 1',
            },
            preCompletionNotes: 'Pre Completion Notes',
            postCompletionNotes: 'Post Completion Notes',
            assignmentDate: '2024-02-14',
            dueDate: '2024-02-21',
            completionDate: '2024-02-21',
            isCompleted: true,
            assigner: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: {
              _id: 'event1',
              title: 'event 1',
            },
            creator: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: AGENDA_ITEM_LIST,
      variables: {
        organizationId: '123',
        orderBy: 'createdAt_ASC',
        agendaItemCategoryId: 'agendaItemCategory1',
        isActive: false,
        isCompleted: true,
      },
    },
    result: {
      data: {
        agendaItemsByOrganization: [
          {
            _id: 'agendaItem1',
            assignee: {
              _id: 'user1',
              firstName: 'Harve',
              lastName: 'Lance',
            },
            agendaItemCategory: {
              _id: 'agendaItemCategory1',
              name: 'AgendaItemCategory 1',
            },
            preCompletionNotes: 'Pre Completion Notes',
            postCompletionNotes: 'Post Completion Notes',
            assignmentDate: '2024-02-14',
            dueDate: '2024-02-21',
            completionDate: '2024-02-21',
            isCompleted: true,
            assigner: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: {
              _id: 'event1',
              title: 'event 1',
            },
            creator: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_AGENDA_ITEM_MUTATION,
      variables: {
        agendaItemCategoryId: 'agendaItemCategory1',
        assigneeId: 'user1',
        preCompletionNotes: 'pre completion notes',
        dueDate: '2024-02-14',
      },
    },
    result: {
      data: {
        createAgendaItem: {
          _id: 'agendaItem2',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_AGENDA_ITEM_MUTATION,
      variables: {
        eventId: 'event1',
        agendaItemCategoryId: 'agendaItemCategory1',
        assigneeId: 'user1',
        preCompletionNotes: 'pre completion notes',
        dueDate: '2024-02-14',
      },
    },
    result: {
      data: {
        createAgendaItem: {
          _id: 'agendaItem2',
        },
      },
    },
  },
];
