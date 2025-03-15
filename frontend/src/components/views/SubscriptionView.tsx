import { Label, Subscription } from '../../api/schema'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Api } from '../../api/api'

import { useNavigate } from 'react-router'

function ModalContent({
  onOk,
  onDiscard,
}: {
  onOk: () => void
  onDiscard: () => void
}) {
  return (
    <div
      className='modal'
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        boxShadow: 'rgba(100, 100, 111, 0.3) 0px 7px 29px 0px',
        backgroundColor: 'white',
        border: '2px solid rgb(240, 240, 240)',
        borderRadius: '12px',
        position: 'absolute',
        width: '250px',
        top: '70px',
        left: 'calc(50% - 125px)',
        bottom: '70px',
      }}
    >
      <div>Are you sure that you want to delete the current subscription?</div>
      <div>
        <button onClick={onOk}>Ok</button>
        <button onClick={onDiscard}>Discard</button>
      </div>
    </div>
  )
}

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
      <h1>{subscription.title}</h1>
      <ul>
        {labels.map(l => (
          <li>{l.name}</li>
        ))}
      </ul>
      <button onClick={() => setShowModal(true)}>Delete</button>
      <button
        onClick={() => navigate(`/subscriptions/${subscription.id}/edit`)}
      >
        Edit
      </button>

      {showModal &&
        createPortal(
          <ModalContent
            onOk={() => {
              Api.deleteSubscription(subscription.id)
              setShowModal(false)
            }}
            onDiscard={() => setShowModal(false)}
          />,
          document.body,
        )}
    </div>
  )
}

export default SubscriptionView
