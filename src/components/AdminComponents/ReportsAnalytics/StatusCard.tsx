/**
 * StatusCard Component
 * 
 * Displays appointment status count in a colored card.
 * Used in the Appointment Status Distribution section.
 * 
 * @component
 * @example
 * <StatusCard 
 *   label="Confirmed" 
 *   value={156} 
 *   color="bg-green-100 text-green-800" 
 * />
 */

interface StatusCardProps {
  /** Status label (e.g., "Confirmed", "Completed") */
  label: string
  /** Numeric count */
  value: number
  /** Tailwind color classes for background and text */
  color: string
}

export default function StatusCard({ label, value, color }: StatusCardProps) {
  return (
    <div className={`${color} rounded-lg p-4 text-center`}>
      {/* Status label */}
      <p className="text-sm font-medium mb-1">{label}</p>
      
      {/* Numeric value */}
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}
