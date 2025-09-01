'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface Question {
  _id?: string
  question: string
  options: string[]
  correctAnswerIndex: number
  category: string
  difficulty: string
  reward: number
  timeLimit: number
}

interface QuizFormProps {
  question?: Question | null
  onSubmit: (data: Omit<Question, '_id'>) => void
  onClose: () => void
}

export default function QuizForm({ question, onSubmit, onClose }: QuizFormProps) {
  const [formData, setFormData] = useState<Omit<Question, '_id'>>({
    question: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    category: 'general',
    difficulty: 'medium',
    reward: 10,
    timeLimit: 5
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (question) {
      setFormData({
        question: question.question,
        options: question.options,
        correctAnswerIndex: question.correctAnswerIndex,
        category: question.category,
        difficulty: question.difficulty,
        reward: question.reward,
        timeLimit: question.timeLimit
      })
    }
  }, [question])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required'
    }

    formData.options.forEach((option, index) => {
      if (!option.trim()) {
        newErrors[`option${index}`] = `Option ${index + 1} is required`
      }
    })

    if (formData.reward < 1) {
      newErrors.reward = 'Reward must be at least 1'
    }

    if (formData.timeLimit < 5) {
      newErrors.timeLimit = 'Time limit must be at least 5 seconds'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {question ? 'Edit Question' : 'Add New Question'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question *
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter your question here..."
            />
            {errors.question && (
              <p className="text-red-500 text-sm mt-1">{errors.question}</p>
            )}
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer Options *
            </label>
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctAnswerIndex === index}
                    onChange={() => setFormData({ ...formData, correctAnswerIndex: index })}
                    className="text-blue-600"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Option ${index + 1}`}
                  />
                  {errors[`option${index}`] && (
                    <p className="text-red-500 text-sm">{errors[`option${index}`]}</p>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Select the radio button next to the correct answer
            </p>
          </div>

          {/* Category and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="science">Science</option>
                <option value="history">History</option>
                <option value="sports">Sports</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Reward and Time Limit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reward (₦)
              </label>
              <input
                type="number"
                value={formData.reward}
                onChange={(e) => setFormData({ ...formData, reward: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
              {errors.reward && (
                <p className="text-red-500 text-sm mt-1">{errors.reward}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (seconds)
              </label>
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="5"
              />
              {errors.timeLimit && (
                <p className="text-red-500 text-sm mt-1">{errors.timeLimit}</p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {question ? 'Update Question' : 'Create Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}