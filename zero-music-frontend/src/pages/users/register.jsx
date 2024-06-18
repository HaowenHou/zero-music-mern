import { Link } from "react-router-dom";
import UserForm from '../../components/UserForm';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-2 ">
      <div className="bg-white rounded shadow-md px-12 py-8">

        <div className='flex justify-between pb-8'>
          <Link to="/" className='flex items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            {t("homepage")}
          </Link>
          <Link to="/users/login" className='pr-2'>{t("login")}</Link>
        </div>

        <h2 className="text-lg font-bold mb-8">{t("newUserRegister")}</h2>

        <UserForm />
      </div>
    </div>
  );
};

export default Register;
