import './index.css'

const AddAdminSkeletonLoading = () => {
    return (
        <div className='test-admin-skeleton-container' >
            <div className="skeleton-admin-data-table">
                <table cellSpacing="0" className='admin-table'>
                    {[1,2,3,4,5,6,7,8].map((data)=>{
                        return <tr   >
                        <td   >
                            <div className='skeleton' ></div>
                        </td>
                        <td   >
                        <div className='skeleton' ></div>
                        </td>
                        <td   >
                        <div className='skeleton' ></div>
                        </td>
                    </tr>
                    })
                    }
                    




                </table>

            </div>
        </div>
    )
}

export default AddAdminSkeletonLoading