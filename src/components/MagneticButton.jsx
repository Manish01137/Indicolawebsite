import { useMagnetic } from '../hooks/useTilt'

/**
 * Button that drifts toward cursor. Pass className like "btn btn-primary".
 */
export default function MagneticButton({ children, strength = 0.3, className = 'btn btn-primary', ...rest }) {
  const ref = useMagnetic({ strength })
  return (
    <div style={{ display: 'inline-block' }}>
      <button ref={ref} className={className} {...rest}>
        {children}
      </button>
    </div>
  )
}
