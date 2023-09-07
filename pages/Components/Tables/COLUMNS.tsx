import Link from "next/link";
import { AiFillEye } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";

export const EmployeeColumnsData = [
    {
        Header: 'EmpID',
        accessor: 'emp_id'
    },
    {
        Header: 'First Name',
        accessor: 'first_name'
    },
    {
        Header: 'Last Name',
        accessor: 'last_name'
    },
    {
        Header: 'Job Profile',
        accessor: 'job_profile'
    },
    {
        Header: 'Phone Number',
        accessor: 'primary_contact_no'
    },
    {
        Header: 'Reporting Manager',
        accessor: 'reporting_to'
    },
    {
        Header: 'Action',
        accessor: '',
        Cell: ({ cell }:any) => (

            <div className='flex gap-2'>
                <button className='hover:text-blue-500 text-xl'>
                    <Link href={"/Profile/Profile?empId=" + cell.row.values.emp_id}>
                        <AiFillEye />
                    </Link>
                </button>
                <button className='hover:text-yellow-400 text-xl'>
                    <Link href={"/Profile/Profile?empId=" + cell.row.values.emp_id}>
                        <BiPencil />
                    </Link>
                </button>
            </div>
        )
    }
]