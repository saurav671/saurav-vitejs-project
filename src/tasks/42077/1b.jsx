import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  Badge,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui';
import { format } from 'date-fns';

function App() {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const priorities = ['low', 'medium', 'high'];
  const statuses = ['Pending', 'Completed'];
  const today = new Date();
  const formattedDate = format(today, 'yyyy-MM-dd');

  const addTodo = (newTodo) => {
    setTodos([...todos, { ...newTodo, id: Date.now(), status: 'Pending' }]);
    setIsModalOpen(false);
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(search.toLowerCase()) &&
        (filterPriority === '' || todo.priority === filterPriority) &&
        (filterStatus === '' || todo.status === filterStatus)
    );
  }, [todos, search, filterPriority, filterStatus]);

  const paginatedTodos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTodos.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTodos, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);

  const markAsCompleted = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, status: 'Completed' } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div className="flex justify-center p-4 sm:p-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>To-Do List</CardTitle>
          <CardDescription>Manage your tasks efficiently.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <Input
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select onValueChange={setFilterPriority}>
              <SelectItem value="">All Priorities</SelectItem>
              {priorities.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </Select>
            <Select onValueChange={setFilterStatus}>
              <SelectItem value="">All Statuses</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </Select>
            <Button onClick={() => setIsModalOpen(true)}>Add To-Do</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTodos.map((todo) => (
                  <tr key={todo.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {todo.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(todo.dueDate), 'MM/dd/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      {todo.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          todo.status === 'Completed' ? 'success' : 'warning'
                        }
                      >
                        {todo.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">Actions</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {todo.status === 'Pending' && (
                            <DropdownMenuItem
                              onClick={() => markAsCompleted(todo.id)}
                            >
                              Mark as Completed
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => deleteTodo(todo.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div>
              Showing{' '}
              {Math.min(filteredTodos.length, currentPage * itemsPerPage)} of{' '}
              {filteredTodos.length} items
            </div>
            <div className="space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    variant={page === currentPage ? 'default' : 'outline'}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TodoForm onSubmit={addTodo} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

function TodoForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, dueDate, priority });
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
  };

  return (
    <ModalContent>
      <ModalHeader>Add New To-Do</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="date"
              label="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <Select
              label="Priority"
              value={priority}
              onValueChange={setPriority}
            >
              {['low', 'medium', 'high'].map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </Select>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button type="submit" onClick={handleSubmit}>
          Add
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default App;
