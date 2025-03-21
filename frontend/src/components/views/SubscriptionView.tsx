import { Label, Subscription } from '../../api/schema'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Api } from '../../api/api'

import { useNavigate } from 'react-router'
import { TbTrash, TbEdit } from 'react-icons/tb'

import TagChip from '../shared/TagChip'
import ConfirmModal from '../shared/ConfirmModal'



const SubscriptionView = ({
  subscription,
  labels,
}: {
  subscription: Subscription
  labels: Label[]
}) => {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  return (
    <div>
      <div className='flex flex-col justify-stretch items-start'>
        <div className='flex flex-row justify-between items-center w-full'>
          <p className='text-4xl'>{subscription.title}</p>
          <button
            onClick={() => navigate(`/subscriptions/${subscription.id}/edit`)}
          >
            <TbEdit className='px-2 size-10 text-purple-700 hover:text-purple-200 transition-all' />
          </button>
        </div>

        <div className='mt-2 mb-2 p-0 flex flex-row'>
          {labels.map(l => (
            <TagChip name={l.name} />
          ))}
        </div>
      </div>
      <button
        className='fixed border-0 bottom-8 right-8 flex items-center justify-center w-30 h-16 bg-purple-300 text-white rounded-2xl shadow-lg hover:bg-purple-600 transition-all'
        onClick={() => setShowModal(true)}
      >
        <TbTrash className='size-10' />
      </button>

      {showModal &&
        createPortal(
          <ConfirmModal
            prompt='Are you sure that you want to delete the current subscription?'
            onOk={() => {
              Api.deleteSubscription(subscription.id)
              setShowModal(false)
              navigate("/subscriptions")
            }}
            onDiscard={() => setShowModal(false)}
          />,
          document.body,
        )}
    </div>
  )
}

export default SubscriptionView
