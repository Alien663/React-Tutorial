import AsyncSelect from "react-select/async";
import { useMemo, useState } from "react";

const DoubleSelect = (props) => {
    const { handleChange, loadLV1Options, LV2Options } = props
    return (
        <div className='flex items-center gap-4'>
            部門
            <AsyncSelect
                defaultOptions
                loadOptions={loadLV1Options}
                onChange={handleChange}
                autoFocus
                openMenuOnFocus
            />
            人員
            <AsyncSelect
                defaultOptions = {LV2Options}
                autoFocus
                openMenuOnFocus
            />
        </div>
    );
};

const QAQ = () => {
    const [dept, setDept] = useState("0");
    const [emp, setEmp] = useState([])
    // ! 員工清單
    const employee = useMemo(
        () => [
            { name: "a", dept: "1" },
            { name: "b", dept: "1" },
            { name: "c", dept: "2" },
            { name: "d", dept: "2" },
            { name: "x", dept: "3" },
            { name: "y", dept: "3" },
            { name: "z", dept: "3" },
        ],[]
    );

    // ! fetch 部門的選項
    const  getDeptOptions = async () => {
        return new Promise((resolve) => {
            resolve([
                { label: "dept-1", value: "1" },
                { label: "dept-2", value: "2" },
                { label: "dept-3", value: "3" },
            ]);
        });
    }

    const getEmpOptions = async (__value) => {
        const empInThisDept = employee.filter((e) => e.dept === __value);
        return new Promise((resolve, reject) => {
            resolve(
                empInThisDept.map(item => {
                    return {label: item.name, value: item.name }
                })
            )
        })
    }

    const handleChangeL1Select = (d) => {
        setDept(d)
        getEmpOptions(d.value)
            .then(res => {
                setEmp(res)
            }
        )
    }

    return(
        <DoubleSelect
            handleChange={handleChangeL1Select}
            loadLV1Options={getDeptOptions}
            LV2Options={emp}>
        </DoubleSelect>
    )
}

export default QAQ
