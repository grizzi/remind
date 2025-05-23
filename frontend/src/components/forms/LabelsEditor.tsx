import { useState, useEffect } from 'react'
import { Label, Subscription } from '../../api/schema'
import TagChip from '../shared/TagChip'
import { FaPlus } from 'react-icons/fa'

const LabelEditor = ({
  subscription,
  allLabels,
  setNewLabels,
}: {
  subscription?: Subscription
  allLabels: Label[]
  setNewLabels: (labels: Label[]) => void
}) => {
  const [subLabels, setSubLabels] = useState<Label[]>([])
  const [newLabel, setNewLabel] = useState<Label>()
  const [uniqueLabels, setUniqueLabels] = useState<Label[]>([])

  // Initialize the labels with the one of the subscription if the subscription is non empty
  useEffect(() => {
    if (subscription) {
      setSubLabels(subscription.labels)
      setNewLabels(subscription.labels)
    } else {
      setSubLabels([])
    }

    let ul: Label[] = []
    for (const label of allLabels) {
      if (ul.find(l => l.name === label.name) === undefined) {
        ul.push(label)
      }
    }
    setUniqueLabels(ul)
  }, [subscription])

  const onAddLabel = () => {
    if (
      newLabel !== undefined &&
      subLabels.filter(l => l.name === newLabel.name).length === 0
    ) {
      setSubLabels([newLabel, ...subLabels])
      console.log(
        'Setting new labels:',
        JSON.stringify([newLabel, ...subLabels]),
      )

      setNewLabels([newLabel, ...subLabels])
    }
    setNewLabel(undefined)
  }

  const sortLabelByName = (label1: Label, label2: Label) =>
    label1.name.localeCompare(label2.name)

  const labelsContainByName = (label: Label, labelsList: Label[]) => {
    return labelsList.filter(l => l.name === label.name).length === 0
  }

  return (
    <div className='w-full flex flex-col'>
      <label>Labels</label>
      <div className='flex flex-wrap flex-col items-center w-full'>
        <div className='flex flex-row items-center w-full'>
          <input
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm'
            type='text'
            value={newLabel?.name ?? ''}
            onChange={e =>
              setNewLabel({
                subscription: subscription?.id,
                name: e.target.value,
              })
            }
            placeholder='Add new label here'
          />
          <button
            type='button'
            className='m-1 ml-4 p-2 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 shadow-md transition-all'
            onClick={onAddLabel}
            aria-label='Add label'
          >
            <FaPlus className='text-gray-600 hover:text-gray-800' />
          </button>
        </div>
        <div className='w-full flex flex-row mt-4'>
          {/* Labels of current subscription */}
          {subLabels
            .sort((a, b) => sortLabelByName(a, b))
            .map(l => (
              <TagChip
                key={l.name}
                name={l.name}
                onClick={() => {
                  setSubLabels(subLabels.filter(sl => sl.name !== l.name))
                  setNewLabels(subLabels.filter(sl => sl.name !== l.name))
                }}
              />
            ))}

          {/* Inactive labels */}
          {uniqueLabels
            .filter(l => labelsContainByName(l, subLabels))
            .sort((a, b) => sortLabelByName(a, b))
            .map(l => (
              <TagChip
                key={l.name}
                disabled={true}
                name={l.name}
                onClick={() => {
                  setSubLabels([
                    { name: l.name, subscription: subscription?.id },
                    ...subLabels,
                  ])
                  setNewLabels([
                    { name: l.name, subscription: subscription?.id },
                    ...subLabels,
                  ])
                }}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default LabelEditor
