import { useState } from 'react';
import { Play, AlertCircle, CheckCircle, Code, Database } from 'lucide-react';

interface QueryResult {
  data?: any;
  errors?: Array<{ message: string }>;
}

export const GraphqlIntrospection = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);

  const schema = {
    types: [
      {
        name: 'Query',
        fields: [
          { name: 'users', type: '[User]', description: 'Get all users' },
          { name: 'user', type: 'User', args: [{ name: 'id', type: 'ID!' }], description: 'Get user by ID' },
          { name: 'posts', type: '[Post]', description: 'Get all posts' },
        ]
      },
      {
        name: 'User',
        fields: [
          { name: 'id', type: 'ID!' },
          { name: 'username', type: 'String!' },
          { name: 'email', type: 'String!' },
          { name: 'bio', type: 'String' },
          { name: 'apiKey', type: 'String', description: 'Hidden field containing sensitive data' },
        ]
      },
      {
        name: 'Post',
        fields: [
          { name: 'id', type: 'ID!' },
          { name: 'title', type: 'String!' },
          { name: 'content', type: 'String!' },
          { name: 'author', type: 'User!' },
        ]
      }
    ]
  };

  const mockData = {
    users: [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        bio: 'System administrator',
        apiKey: 'NCG{graphql_introspection_exposes_schema}'
      },
      {
        id: '2',
        username: 'alice',
        email: 'alice@example.com',
        bio: 'Security researcher',
        apiKey: 'sk_live_abc123xyz789'
      },
      {
        id: '3',
        username: 'bob',
        email: 'bob@example.com',
        bio: 'Developer',
        apiKey: 'sk_live_def456uvw012'
      },
    ],
    posts: [
      { id: '1', title: 'GraphQL Best Practices', content: 'Always disable introspection in production...', authorId: '1' },
      { id: '2', title: 'API Security 101', content: 'Never expose sensitive fields...', authorId: '2' },
    ]
  };

  const executeQuery = () => {
    setLoading(true);

    setTimeout(() => {
      try {
        if (query.includes('__schema') || query.includes('__type')) {
          const introspectionResult = {
            data: {
              __schema: {
                types: schema.types.map(type => ({
                  name: type.name,
                  kind: 'OBJECT',
                  fields: type.fields.map(field => ({
                    name: field.name,
                    type: { name: field.type, kind: 'SCALAR' },
                    description: field.description || null,
                    args: field.args || []
                  }))
                }))
              }
            }
          };
          setResult(introspectionResult);
        }
        else if (query.includes('users') && query.includes('apiKey')) {
          setResult({
            data: {
              users: mockData.users
            }
          });
        }
        else if (query.includes('users')) {
          setResult({
            data: {
              users: mockData.users.map(u => ({
                id: u.id,
                username: u.username,
                email: u.email,
                bio: u.bio
              }))
            }
          });
        }
        else if (query.includes('user') && query.includes('apiKey')) {
          const userId = query.match(/id:\s*"(\d+)"/)?.[1] || '1';
          const user = mockData.users.find(u => u.id === userId);
          setResult({
            data: {
              user: user || null
            }
          });
        }
        else if (query.includes('user')) {
          const userId = query.match(/id:\s*"(\d+)"/)?.[1] || '1';
          const user = mockData.users.find(u => u.id === userId);
          setResult({
            data: {
              user: user ? {
                id: user.id,
                username: user.username,
                email: user.email,
                bio: user.bio
              } : null
            }
          });
        }
        else if (query.includes('posts')) {
          setResult({
            data: {
              posts: mockData.posts.map(p => {
                const author = mockData.users.find(u => u.id === p.authorId);
                return {
                  ...p,
                  author: author ? {
                    id: author.id,
                    username: author.username,
                    email: author.email
                  } : null
                };
              })
            }
          });
        }
        else {
          setResult({
            errors: [{ message: 'Invalid query syntax' }]
          });
        }
      } catch (error) {
        setResult({
          errors: [{ message: 'Query execution failed' }]
        });
      }
      setLoading(false);
    }, 500);
  };

  const exampleQueries = [
    {
      name: 'List Users',
      query: `query {
  users {
    id
    username
    email
  }
}`
    },
    {
      name: 'Get User',
      query: `query {
  user(id: "1") {
    id
    username
    email
    bio
  }
}`
    },
    {
      name: 'Introspection Query',
      query: `query {
  __schema {
    types {
      name
      fields {
        name
        type {
          name
        }
        description
      }
    }
  }
}`
    }
  ];

  return (
    <div className="bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-700">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">GraphQL API Playground</h2>
            <p className="text-sm text-slate-400">https://api.example.com/graphql</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 p-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Code className="w-4 h-4" />
                GraphQL Query
              </label>
              <button
                onClick={executeQuery}
                disabled={loading || !query.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                <Play className="w-4 h-4" />
                {loading ? 'Executing...' : 'Execute Query'}
              </button>
            </div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your GraphQL query here..."
              className="w-full h-64 px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              spellCheck={false}
            />
          </div>

          {result && (
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Response
              </label>
              <div className={`p-4 rounded-lg border ${
                result.errors
                  ? 'bg-red-950/50 border-red-800'
                  : 'bg-emerald-950/50 border-emerald-800'
              }`}>
                {result.errors ? (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      {result.errors.map((error, idx) => (
                        <p key={idx} className="text-red-300 text-sm">{error.message}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-300 text-sm font-medium">Query executed successfully</span>
                    </div>
                    <pre className="text-slate-300 text-sm overflow-x-auto font-mono bg-slate-950 p-3 rounded border border-slate-800">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Example Queries</h3>
            <div className="space-y-2">
              {exampleQueries.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(example.query)}
                  className="w-full text-left px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg transition-colors"
                >
                  <p className="text-sm font-medium text-white">{example.name}</p>
                  <p className="text-xs text-slate-400 mt-1">Click to load</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-yellow-950/30 border border-yellow-800/50 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-200 text-xs font-medium">Challenge Hint</p>
            </div>
            <p className="text-yellow-300/90 text-xs leading-relaxed">
              GraphQL introspection allows you to query the schema itself. Try using introspection to discover all available fields, including hidden ones that might contain sensitive data.
            </p>
          </div>

          <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <p className="text-slate-300 text-xs leading-relaxed">
              <span className="font-semibold text-white">Tip:</span> Once you discover hidden fields via introspection, construct a new query to retrieve the actual data from those fields.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
