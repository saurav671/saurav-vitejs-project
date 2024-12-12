import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

export default function App() {
  const [todos, setTodos] = useState([]); // List of to-dos
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'low',
  }); // New to-do input
  const [searchTerm, setSearchTerm] = useState(''); // Search term
  const [priorityFilter, setPriorityFilter] = useState('all'); // Priority filter
  const [statusFilter, setStatusFilter] = useState('all'); // Status filter
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const [itemsPerPage, setItemsPerPage] = useState(5); // Items per page

  // Add a new to-do
  const handleAddTodo = () => {
    const newItem = {
      ...newTodo,
      id: Date.now(),
      status: 'Pending',
    };
    setTodos([...todos, newItem]);
    setNewTodo({ title: '', description: '', dueDate: '', priority: 'low' });
    setIsModalOpen(false);
  };

  // Mark a to-do as completed
  const markAsCompleted = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, status: 'Completed' } : todo
      )
    );
  };

  // Delete a to-do
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Filter todos
  const filteredTodos = todos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (priorityFilter === 'all' || todo.priority === priorityFilter) &&
      (statusFilter === 'all' ||
        (statusFilter === 'Pending' && todo.status === 'Pending') ||
        (statusFilter === 'Completed' && todo.status === 'Completed'))
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTodos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <CardTitle>To-Do List</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Input
              placeholder="Search by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Select
              value={priorityFilter}
              onValueChange={setPriorityFilter}
              className="w-full sm:w-40 relative z-10"
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Priority" />
              </SelectTrigger>
              <SelectContent className="absolute top-full mt-2 bg-white shadow-md rounded-md">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="w-full sm:w-40 relative z-10"
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="absolute top-full mt-2 bg-white shadow-md rounded-md">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add New Todo Button */}
          <Button onClick={() => setIsModalOpen(true)} className="mb-4">
            Add New Todo
          </Button>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((todo) => (
                <TableRow key={todo.id}>
                  <TableCell>{todo.title}</TableCell>
                  <TableCell>{todo.dueDate}</TableCell>
                  <TableCell>{todo.priority}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        todo.status === 'Completed' ? 'success' : 'warning'
                      }
                    >
                      {todo.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        todo.status === 'Pending'
                          ? markAsCompleted(todo.id)
                          : deleteTodo(todo.id)
                      }
                      variant="outline"
                    >
                      {todo.status === 'Pending' ? 'Complete' : 'Delete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div>
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredTodos.length)} of{' '}
              {filteredTodos.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Todo Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Todo</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Title"
              value={newTodo.title}
              onChange={(e) =>
                setNewTodo({ ...newTodo, title: e.target.value })
              }
            />
            <Input
              placeholder="Description"
              value={newTodo.description}
              onChange={(e) =>
                setNewTodo({ ...newTodo, description: e.target.value })
              }
            />
            <Input
              type="date"
              value={newTodo.dueDate}
              onChange={(e) =>
                setNewTodo({ ...newTodo, dueDate: e.target.value })
              }
            />
            <Select
              value={newTodo.priority}
              onValueChange={(value) =>
                setNewTodo({ ...newTodo, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleAddTodo}>Add Todo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
