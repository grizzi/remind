import { ErrorMessage, useField } from 'formik'

const CheckboxField = (props: {
  label?: string
  id: string
  disabled?: boolean
}) => {
  const [field] = useField({ name: props.id, type: 'checkbox' })

  return (
    <div className='flex flex-row justify-between items-center w-full'>
      {props.label && <label>{props.label}</label>}

      <div className='flex flex-col items-center justify-center gap-1'>
        <label className='relative inline-flex items-center cursor-pointer w-fit'>
          <input
            {...field}
            id={props.id}
            disabled={props.disabled}
            type='checkbox'
            className='sr-only peer'
          />
          <div
            className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-pink-500
            peer-checked:bg-purple-600 transition-all duration-300
            ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          <div
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300
            peer-checked:translate-x-5
            ${props.disabled ? 'opacity-75' : ''}`}
          />
        </label>
      </div>
    </div>
  )
}

export default CheckboxField
