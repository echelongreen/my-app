import { downloadFile } from '@/app/actions/files'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const url = await downloadFile(params.fileId)
    return NextResponse.redirect(url)
  } catch (error) {
    console.error('Download error:', error)
    return new NextResponse('Error downloading file', { status: 500 })
  }
} 