import { Ticket } from './types'

export const tickets: Ticket[] = [
  {
    id: '1',
    title: 'Login button not working',
    priority: 'HIGH',
    status: 'TODO',
    assignee: { name: 'Rahul' }
  },
  {
    id: '2',
    title: 'UI breaks on mobile',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    assignee: { name: 'Anita' }
  },
  {
    id: '3',
    title: 'Improve dashboard speed',
    priority: 'LOW',
    status: 'DONE',
    assignee: { name: 'Vikas' }
  }
]
