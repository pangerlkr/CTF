import { useState } from 'react';
import { Upload, FileIcon, Folder, MoreVertical, Grid3x3, List, Search, Plus, Image, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  type: string;
  icon: React.ReactNode;
  previewUrl?: string;
}

const FILE_PREVIEW_MAP: Record<string, string> = {
  'Summer_Vacation_2023.jpg': '/summer-vacation.jpeg',
  'Family_Photo.png': '/family.jpeg',
  'Project_Proposal.pdf': '/project-proposal.pdf'
};

export const FileUploadBypass = () => {
  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'Summer_Vacation_2023.jpg',
      size: '2.4 MB',
      uploadedAt: 'Jan 15, 2024',
      type: 'image',
      icon: <Image className="w-5 h-5" />,
      previewUrl: '/summer-vacation.jpeg'
    },
    {
      id: '2',
      name: 'Project_Proposal.pdf',
      size: '856 KB',
      uploadedAt: 'Jan 12, 2024',
      type: 'document',
      icon: <FileText className="w-5 h-5" />,
      previewUrl: '/project-proposal.pdf'
    },
    {
      id: '3',
      name: 'Family_Photo.png',
      size: '1.8 MB',
      uploadedAt: 'Jan 10, 2024',
      type: 'image',
      icon: <Image className="w-5 h-5" />,
      previewUrl: '/family.jpeg'
    }
  ]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setMessage(null);

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    await new Promise(resolve => setTimeout(resolve, 800));

    if (allowedTypes.includes(file.type)) {
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: file.type.startsWith('image') ? 'image' : 'document',
        icon: file.type.startsWith('image') ? <Image className="w-5 h-5" /> : <FileText className="w-5 h-5" />
      };
      setFiles([newFile, ...files]);
      setMessage({ type: 'success', text: `${file.name} uploaded successfully!` });
    } else if (fileExtension === 'php' || fileExtension === 'sh' || fileExtension === 'py') {
      if (file.name.includes('.jpg') || file.name.includes('.png') || file.name.includes('.gif')) {
        const newFile: UploadedFile = {
          id: Date.now().toString(),
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          type: 'document',
          icon: <FileText className="w-5 h-5" />
        };
        setFiles([newFile, ...files]);
        setMessage({
          type: 'success',
          text: `Congratulations! You bypassed the validation! Flag: NCG{double_extension_bypass_works}`
        });
      } else {
        setMessage({
          type: 'error',
          text: 'File type not allowed. Only images (JPEG, PNG, GIF) are permitted.'
        });
      }
    } else {
      setMessage({
        type: 'error',
        text: 'File type not allowed. Only images (JPEG, PNG, GIF) are permitted. Hint: Try using double extensions!'
      });
    }

    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    e.target.value = '';
  };

  const handleFileClick = (file: UploadedFile) => {
    if (file.previewUrl) {
      setPreviewFile(file);
    }
  };

  return (
    <>
      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPreviewFile(null)}>
          <div className="relative max-w-6xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewFile(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">{previewFile.name}</h3>
              </div>
              <div className="p-4 max-h-[80vh] overflow-auto">
                {previewFile.type === 'image' ? (
                  <img
                    src={previewFile.previewUrl}
                    alt={previewFile.name}
                    className="w-full h-auto"
                  />
                ) : (
                  <iframe
                    src={previewFile.previewUrl}
                    className="w-full h-[70vh]"
                    title={previewFile.name}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">My Drive</h3>
                <p className="text-sm text-gray-500">Image Upload Portal</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and New Button */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search in Drive"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Upload</span>
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`px-6 py-3 flex items-center justify-between ${
          message.type === 'success' ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {message.text}
            </span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div className="p-6">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 transition-all ${
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {uploading ? 'Uploading...' : 'Drop files to upload'}
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              or click the "New Upload" button above
            </p>
            <p className="text-xs text-gray-500">
              Only image files (JPEG, PNG, GIF) are allowed
            </p>
          </div>
        </div>
      </div>

      {/* Files Section */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Recent Files
          </h4>
          <span className="text-sm text-gray-500">{files.length} files</span>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => handleFileClick(file)}
                className="group border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    {file.icon}
                  </div>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <h5 className="text-sm font-medium text-gray-900 mb-1 truncate">
                  {file.name}
                </h5>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{file.size}</span>
                  <span>{file.uploadedAt}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => handleFileClick(file)}
                className="group flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="p-2 bg-blue-50 rounded text-blue-600">
                  {file.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </h5>
                  <p className="text-xs text-gray-500">
                    {file.uploadedAt} • {file.size}
                  </p>
                </div>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 rounded transition-opacity"
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Storage Info */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Storage used</span>
          <span className="font-medium text-gray-900">5.2 GB of 15 GB</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
        </div>
      </div>
      </div>
    </>
  );
};
