export default function LoginForm({
  title,
  action,
  error,
}: {
  title: string;
  action: (formData: FormData) => void | Promise<void>;
  error?: string;
}) {
  return (
    <div className="mx-auto mt-24 max-w-sm">
      <h1 className="mb-6 text-xl font-medium text-slate-900">{title}</h1>
      <form action={action} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-slate-600" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-600" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-600">Incorrect email or password.</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
