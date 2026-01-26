import { Ticket } from './types'

export const tickets: Ticket[] = [
  {
    _id: '1',
    title: 'Login button not working',
    priority: 'HIGH',
    status: 'TODO',
    assignee: { name: 'Rahul' }
  },
  {
    _id: '2',
    title: 'UI breaks on mobile',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    assignee: { name: 'Anita' }
  },
  {
    _id: '3',
    title: 'Improve dashboard speed',
    priority: 'LOW',
    status: 'DONE',
    assignee: { name: 'Vikas' }
  }
]
