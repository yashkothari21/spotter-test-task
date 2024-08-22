import React from 'react'
import {
	Box,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from '@mui/material'
import { grey } from '@mui/material/colors'

const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
	rows = 11,
	columns = 5,
}) => {
	return (
		<Box
			sx={{
				width: '100%',
				overflow: 'hidden',
				bgcolor: grey[50],
				borderRadius: '4px',
			}}
		>
			<Table>
				<TableHead>
					<TableRow>
						{Array.from({ length: columns }).map((_, index) => (
							<TableCell key={index} sx={{ height: '32px', padding: '0 16px' }}>
								<Skeleton
									variant='text'
									sx={{
										bgcolor: grey[300],
										height: '14px',
									}}
								/>
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{Array.from({ length: rows }).map((_, rowIndex) => (
						<TableRow key={rowIndex}>
							{Array.from({ length: columns }).map((_, colIndex) => (
								<TableCell
									key={colIndex}
									sx={{ height: '32px', padding: '0 16px' }}
								>
									<Skeleton
										variant='rectangular'
										width='100%'
										sx={{
											bgcolor: grey[300],
											height: '14px',
										}}
									/>
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Box>
	)
}

export default TableSkeleton
