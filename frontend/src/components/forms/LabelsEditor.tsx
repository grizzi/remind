import { useState, useEffect } from 'react'
import { Label, Subscription } from '../../api/schema'
import TagChip from '../shared/TagChip'

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
    <div>
      <div className='flex flex-col'>
        <div className='flex flex-wrap flex-row items-center w-full mt-4'>
          <input
            className='max-w-48 pl-2'
            type='text'
            value={newLabel && newLabel.name}
            onChange={e =>
              setNewLabel({
                subscription: subscription?.id,
                name: e.target.value,
              })
            }
            placeholder='Add new label here'
          />
          <button
            className='m-1 min-w-14 rounded-lg shadow-md px-3 justify-center transition-all'
            onClick={() => onAddLabel()}
          >
            Add label
          </button>

          {/* Labels of current subscription */}
          {subLabels
            .sort((a, b) => sortLabelByName(a, b))
            .map(l => (
              <TagChip
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
