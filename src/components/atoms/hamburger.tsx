
const Hamburger = ({
  setIsOpen,
  isOpen,
  className
}: any) => {
  // const [isOpen, setIsOpen] = useState(onOpen)
  const genericHamburgerLine = `h-1 w-8 m-1 rounded-full bg-white transition ease transform duration-300`;

  return (
    <div className={`z-[60] ${className} w-fit h-fit`}>
      <div className={`flex items-center ${className}`}>
        <button
          className="flex flex-col md h-10 justify-center items-left group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className={`${genericHamburgerLine} opacity-50 group-hover:opacity-100`}
          />
          <div
            className={`${genericHamburgerLine} opacity-50 group-hover:opacity-100`}
          />
          <div
            className={`${genericHamburgerLine} opacity-50 group-hover:opacity-100`}
          />
        </button>
        {/* {
        isOpen ?
          <div
            className="transition ease transform cursor-pointer text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            Close
          </div>
          : ""
      } */}
      </div>
    </div>
  )
}

export default Hamburger