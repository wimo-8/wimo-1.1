import { requestOtp, confirmOtp } from '@/app/actions';

export default function LoginPage() {
  const sendOtp = async (formData: FormData) => {
    'use server';
    await requestOtp(formData);
  };

  const verifyOtp = async (formData: FormData) => {
    'use server';
    await confirmOtp(formData);
  };
  return (
    <div className="max-w-md space-y-4">
      <div className="card space-y-2">
        <h1 className="text-xl font-bold">تسجيل برقم الهاتف</h1>
        <p className="text-sm text-slate-600">ندعم أرقام آسياسيل وزين فقط. رمز التفعيل يصل خلال ثواني.</p>
        <form action={sendOtp} className="space-y-3">
          <label className="text-sm">رقم الهاتف</label>
          <input name="phone" className="w-full rounded-lg border px-3 py-2" placeholder="07xxxxxxxx" required />
          <button className="btn" type="submit">أرسل الرمز</button>
        </form>
      </div>
      <div className="card space-y-2">
        <h2 className="text-lg font-semibold">عندي الرمز</h2>
        <form action={verifyOtp} className="space-y-3">
          <div>
            <label className="text-sm">رقم الهاتف</label>
            <input name="phone" className="w-full rounded-lg border px-3 py-2" required />
          </div>
          <div>
            <label className="text-sm">رمز OTP</label>
            <input name="code" className="w-full rounded-lg border px-3 py-2" maxLength={6} required />
          </div>
          <button className="btn" type="submit">تأكيد الدخول</button>
        </form>
      </div>
    </div>
  );
}
