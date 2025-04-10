import { baseUrl } from "../../helpers"

interface Img {
  src?: string
  srcServer?: string
  alt?: string
  className?: string
  onClick?: () => void
  toolTip?: string
  title?: string
}

const Img = ({
  src,
  srcServer,
  alt,
  className,
  onClick,
  title
}: Img) => {
  // const errorPath = baseUrl("/assets/icons/no-image.svg")
  const errorPath = baseUrl("/no-image.svg")
  const newSrc = src ? src : "http://" + import.meta.env.VITE_IMAGE_SERVER + "/" + srcServer

  return (
    <img
      title={title}
      onClick={onClick}
      src={newSrc}
      alt={alt}
      className={className}
      onError={(e: any) => {
        e.target.onerror = null
        e.target.src = errorPath
      }}
    />
  )
}

export default Img