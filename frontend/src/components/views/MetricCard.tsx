const MetricCard = ({
  header,
  details,
  loadingDetails,
}: {
  header: string
  details: string
  loadingDetails?: boolean
}) => {
  return (
    <div className='flex flex-row bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-xl p-1 shadow-md w-full m-2'>
      <div className='w-full flex flex-col'>
        <p className='pl-2 pt-2 text-3xl '>{header}</p>

        <div className='flex flex-row justify-end min-h-[2.5rem] p-1 mr-2'>
          {!loadingDetails ? (
            <p className='text-xl'>{details}</p>
          ) : (
            <div className='h-6 w-32 animate-pulse opacity-0 rounded-md bg-white/50 backdrop-blur-2xl shadow-inner' />
          )}
        </div>
      </div>
    </div>
  )
}

export default MetricCard
