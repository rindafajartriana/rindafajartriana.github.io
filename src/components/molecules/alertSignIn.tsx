import Modals from "../atoms/modals";

interface AlertSignin {
  isLoading?: boolean
  isOpen: boolean
  setIsOpen?: (val: boolean) => void
  message?: string
}

const AlertSignin = ({
  isLoading,
  isOpen,
  setIsOpen,
  message
}: AlertSignin) => {
  return (
    <Modals isOpen={isOpen} setIsOpen={setIsOpen} preventClose={isLoading}>
      <div className="modal-card animation-fadein">
        <h3 className="text-red-900">Failed</h3>
        {message && <h4 className="text-gray-500">{message}</h4>}
        <button
          onClick={() => setIsOpen && setIsOpen(false)}
          className="btn color-secondary text-xs w-fit"
        >
          OK
        </button>
      </div>
    </Modals>
  );
};

export default AlertSignin;