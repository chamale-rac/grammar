import React, { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import { WorkFormProxy } from '@/config/proxies'

import PhotoAlbum from 'react-photo-album'

import 'yet-another-react-lightbox/styles.css'

import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Download from 'yet-another-react-lightbox/plugins/download'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

const breakpoints = [4320, 2160, 1080, 640, 384, 256, 128]

interface ImageTransformed {
	src: string
	width: number
	height: number
	srcSet: {
		src: string
		width: number
		height: number
	}[]
	alt: string
	description: string
	title: string
}

export const ImagesReceiver: React.FC = () => {
	const [index, setIndex] = useState(-1)
	const [photos, setPhotos] = useState<ImageTransformed[]>([])
	const snap = useSnapshot(WorkFormProxy)

	useEffect(() => {
		const transformedImages = snap.images.map((photo) => {
			const width = photo.width * 4
			const height = photo.height * 4

			return {
				src: photo.src,
				width,
				height,
				srcSet: breakpoints.map((breakpoint) => {
					const breakpointHeight = Math.round((height / width) * breakpoint)
					return {
						src: photo.src,
						width: breakpoint,
						height: breakpointHeight,
					}
				}),
				alt: photo.alt,
				description: photo.description,
				title: photo.title,
			}
		})
		setPhotos(transformedImages)
	}, [snap.images])

	return (
		<>
			<PhotoAlbum
				photos={photos}
				layout='columns'
				targetRowHeight={150}
				onClick={({ index }) => setIndex(index)}
				rowConstraints={{
					maxPhotos: 2,
				}}
			/>
			<Lightbox
				slides={photos}
				open={index >= 0}
				index={index}
				close={() => setIndex(-1)}
				// enable optional lightbox plugins
				plugins={[Captions, Thumbnails, Zoom, Download]}
				thumbnails={{
					imageFit: 'cover',
					showToggle: true,
				}}
				captions={{
					showToggle: true,
				}}
			/>
		</>
	)
}
