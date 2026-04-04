import styles from './DataTable.module.css'

export interface Column {
  key: string
  label: string
  width?: string
  render?: (value: any, row: any) => React.ReactNode
}

interface Props {
  columns: Column[]
  data: any[]
  loading?: boolean
  onRowClick?: (row: any) => void
  actions?: (row: any) => React.ReactNode
}

export default function DataTable({ columns, data, loading = false, onRowClick, actions }: Props) {
  if (loading) {
    return <div className={styles.loading}><span className="spinner" /> Loading...</div>
  }

  if (data.length === 0) {
    return <div className={styles.empty}>No data to display</div>
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} onClick={() => onRowClick?.(row)}>
              {columns.map((col) => (
                <td key={`${idx}-${col.key}`}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && <td className={styles.actions}>{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
