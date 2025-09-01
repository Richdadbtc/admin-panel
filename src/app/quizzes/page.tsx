'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import api from '@/lib/api'
import AdminLayout from '@/components/layout/AdminLayout'
import QuizForm from '@/components/quiz/QuizForm'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface Question {
  _id: string
  question: string
  options: string[]
  correctAnswerIndex: number
  category: string
  difficulty: string
  reward: number
  timeLimit: number
  isActive: boolean
  createdAt: string
}

export default function QuizzesPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    isActive: ''
  })
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })

  useEffect(() => {
    fetchQuestions()
  }, [filters, pagination.current])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: '20',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      })
      
      const response = await api.get(`/api/v1/admin/quiz/questions?${params}`)
      setQuestions(response.data.questions)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Failed to fetch questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateQuestion = () => {
    setEditingQuestion(null)
    setShowForm(true)
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    setShowForm(true)
  }

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingQuestion) {
        await api.put(`/api/v1/admin/quiz/questions/${editingQuestion._id}`, data)
      } else {
        await api.post('/api/v1/admin/quiz/questions', data)
      }
      fetchQuestions()
      setShowForm(false)
      setEditingQuestion(null)
    } catch (error) {
      console.error('Failed to save question:', error)
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await api.delete(`/api/v1/admin/quiz/questions/${questionId}`)
      fetchQuestions()
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete question:', error)
    }
  }

  const handleToggleActive = async (questionId: string, isActive: boolean) => {
    try {
      await api.put(`/api/v1/admin/quiz/questions/${questionId}`, { isActive: !isActive })
      fetchQuestions()
    } catch (error) {
      console.error('Failed to toggle question status:', error)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quiz Management</h1>
          <button
            onClick={handleCreateQuestion}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="science">Science</option>
              <option value="history">History</option>
              <option value="sports">Sports</option>
              <option value="entertainment">Entertainment</option>
            </select>
            
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            
            <button
              onClick={() => setFilters({ category: '', difficulty: '', isActive: '' })}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Question
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Difficulty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reward
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {questions.map((question) => (
                      <tr key={question._id}>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {question.question}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {question.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {question.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₦{question.reward}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            question.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {question.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleToggleActive(question._id, question.isActive)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              {question.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleEditQuestion(question)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(question._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPagination({ ...pagination, current: pagination.current - 1 })}
                    disabled={pagination.current === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination({ ...pagination, current: pagination.current + 1 })}
                    disabled={pagination.current === pagination.pages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{pagination.current}</span> of{' '}
                      <span className="font-medium">{pagination.pages}</span> ({pagination.total} total)
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setPagination({ ...pagination, current: page })}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.current
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quiz Form Modal */}
      {showForm && (
        <QuizForm
          question={editingQuestion}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false)
            setEditingQuestion(null)
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmDialog
                  title="Delete Question"
                  message="Are you sure you want to delete this question? This action cannot be undone."
                  onConfirm={() => handleDeleteQuestion(deleteConfirm)}
                  onClose={() => setDeleteConfirm(null)} isOpen={false}        />
      )}
    </AdminLayout>
  )
}