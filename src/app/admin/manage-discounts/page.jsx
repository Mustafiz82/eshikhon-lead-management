"use client";

import useDelete from "@/hooks/useDelete";
import useFetch from "@/hooks/useFetch";
import useSaveData from "@/hooks/useSaveData";
import Table from "@/shared/Table";
import { formateDate } from "@/utils/date";
import { formateDiscount } from "@/utils/formateDiscount";
import React, { useEffect, useMemo, useState } from "react";
import { MultiSelect } from "primereact/multiselect";

import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

export default function ManageDiscountPage() {
    const { data: discounts = [], loading, error, refetch } = useFetch("/discount");
    const { data: courses = [] } = useFetch("/course");

    const {
        setEditCourse: setEditDiscount,
        editCourse: editDiscount,
        handleSave,
        loading: isSubmitting,
        error: submitError,
    } = useSaveData(refetch);

    const { handleDelete } = useDelete(refetch, "discount");

    const [authority, setAuthority] = useState(editDiscount?.authority || "");
    const [mode, setMode] = useState(editDiscount?.mode || "");
    const [appliesTo, setAppliesTo] = useState(
        Array.isArray(editDiscount?.appliesTo)
            ? editDiscount.appliesTo.map(String)
            : []
    );
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        setAuthority(editDiscount?.authority || "");
        setMode(editDiscount?.mode || "");
        setAppliesTo(
            Array.isArray(editDiscount?.appliesTo)
                ? editDiscount.appliesTo.map(String)
                : []
        );
    }, [editDiscount]);

    const courseOptions = useMemo(() => {
        const seen = new Set();

        return (courses ?? [])
            .map(c => ({
                label: c.name + "-" + c.type,
                value: String(c._id ?? c.id),
                type : c.type
            }));
    }, [courses]);


    const startDate = (row) => formateDate(row.startAt);
    const endDate = (row) => formateDate(row.expireAt);

    const getStatus = (row) => {
        const now = new Date();
        const s = new Date(row.startAt);
        const e = new Date(row.expireAt);
        if (now < s) return "pending";
        if (now > e) return "expired";
        return "active";
    };

    const appliedCount = (row) =>
        Array.isArray(row.appliesTo) ? row.appliesTo.length : 0;

    const actionsCell = (row) => (
        <div className="flex gap-2">
            <button
                className="btn btn-sm bg-blue-600 btn-primary"
                onClick={() => setEditDiscount(row)}
            >
                Edit
            </button>
            <button
                className="btn btn-sm bg-red-500"
                onClick={() => handleDelete(`/discount/${row._id ?? row.id}`)}
            >
                Delete
            </button>
        </div>
    );

    const courseConfig = {
        header: [
            "Name",
            "Authority",

            "Discount",
            "Start",
            "Expire",
            "Status",
            "Applied",
            "Action",
        ],
        body: [
            "name",
            "authority",

            formateDiscount,
            startDate,
            endDate,
            getStatus,
            appliedCount,
            actionsCell,
        ],
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        const payload = {
            name: form.name.value.trim(),
            authority: form.authority.value,
            mode: form.mode.value,
            value: form.value?.value ? Number(form.value.value) : null,
            minValue: form.minValue?.value ? Number(form.minValue.value) : null,
            maxValue: form.maxValue?.value ? Number(form.maxValue.value) : null,
            capAmount: form.capAmount?.value ? Number(form.capAmount.value) : null,
            startAt: form.startAt.value || undefined,
            expireAt: form.expireAt.value || undefined,
            appliesTo,
            notes: form.notes?.value.trim() || "",
        };

        console.log(payload)

        if (payload.authority === "committed") {
            payload.minValue = null;
            payload.maxValue = null;
        } else {
            payload.value = null;
        }

        if (payload.mode !== "percent") {
            payload.capAmount = null;
        }

        await handleSave(payload,  form, "/discount");

        setAuthority("")
        setMode("")


    };

    return (
        <div className="flex min-h-[calc(100vh-100px)] lg:h-screen overflow-hidden">
            {loading ? (
                <p className="h-[300px] flex justify-center items-center w-full">
                    Loading...
                </p>
            ) : error ? (
                <p className="h-[300px] text-red-500 flex justify-center items-center w-full">
                    Error Fetching Data
                </p>
            ) : (
                <>
                    <Table data={discounts} width={"1000px"} config={courseConfig} />

                    <div className={`h-full ${showModal ? "fixed lg:static top-0 left-0 w-full lg:w-auto z-9999 block " : "hidden lg:block"}  w-[400px] bg-gray-800 shadow-lg p-6`}>
                        <form
                            autoComplete="off"
                            onSubmit={handleSubmit}
                            className="flex flex-col h-full"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">
                                    {editDiscount ? "Edit Discount" : "Add New Discount"}
                                </h2>
                                <button
                                    type="button"
                                    className="btn btn-xs btn-outline"
                                    onClick={() => {
                                        setEditDiscount(null)
                                        setShowModal(false)
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Close
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                <input
                                    name="name"
                                    required
                                    placeholder="Discount Name"
                                    defaultValue={editDiscount?.name || ""}
                                    className="input bg-gray-900 input-bordered w-full focus:outline-0 focus:border-blue-500"
                                    disabled={isSubmitting}
                                />

                                <select
                                    name="authority"
                                    className="select px-2 bg-gray-900 w-full focus:outline-0 focus:border-blue-500"
                                    value={authority}          // <-- controlled
                                    onChange={(e) => setAuthority(e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                >
                                    <option value="" disabled>
                                        Pick authority
                                    </option>
                                    <option value="agent">Agent</option>
                                    <option value="management">Management</option>
                                    <option value="committed">Committed</option>
                                </select>

                                <select
                                    name="mode"
                                    className="select px-2 bg-gray-900 w-full focus:outline-0 focus:border-blue-500"
                                    value={mode}               // <-- controlled
                                    onChange={(e) => setMode(e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                >
                                    <option value="" disabled>
                                        Pick mode
                                    </option>
                                    <option value="percent">Percent</option>
                                    <option value="amount">Amount</option>
                                </select>


                                {authority === "committed" && (
                                    <input
                                        type="number"
                                        name="value"
                                        placeholder={mode === "percent" ? "Value (0–100)" : "Value (> 0)"}
                                        defaultValue={editDiscount?.value ?? ""}
                                        className="input bg-gray-900 input-bordered w-full focus:outline-0 focus:border-blue-500"
                                        disabled={isSubmitting}
                                        min={0}
                                        step="1"
                                        required
                                    />
                                )}

                                {(authority === "agent" || authority === "management") && (
                                    <>
                                        <input
                                            type="number"
                                            name="minValue"
                                            placeholder="Min Value"
                                            defaultValue={editDiscount?.minValue ?? ""}
                                            className="input bg-gray-900 input-bordered w-full focus:outline-0 focus:border-blue-500"
                                            disabled={isSubmitting}
                                            min={0}
                                            step="1"
                                            required
                                        />
                                        <input
                                            type="number"
                                            name="maxValue"
                                            placeholder="Max Value"
                                            defaultValue={editDiscount?.maxValue ?? ""}
                                            className="input bg-gray-900 input-bordered w-full focus:outline-0 focus:border-blue-500"
                                            disabled={isSubmitting}

                                            min={0}
                                            step="1"
                                            required
                                        />
                                    </>
                                )}

                                {mode === "percent" && (
                                    <input
                                        type="number"
                                        name="capAmount"
                                        placeholder="Cap Amount (optional)"
                                        defaultValue={editDiscount?.capAmount ?? ""}
                                        className="input bg-gray-900 input-bordered w-full focus:outline-0 focus:border-blue-500"
                                        disabled={isSubmitting}
                                        min={0}
                                        step="1"
                                    />
                                )}

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-white/80 mb-1">
                                        Discount Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="startAt"
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                        defaultValue={editDiscount?.startAt?.slice(0, 10) || ""}
                                        className="input bg-gray-900  input-bordered w-full focus:outline-0 focus:border-blue-500"
                                        disabled={isSubmitting}
                                        
                                    />
                                </div>  

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-white/80 mb-1">
                                        Discount End Date
                                    </label>
                                    <input
                                        type="date"
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                        name="expireAt"
                                        defaultValue={editDiscount?.expireAt?.slice(0, 10) || ""}
                                        className="input bg-gray-900 input-bordered w-full focus:outline-0 focus:border-blue-500"
                                        disabled={isSubmitting}
                                    
                                    />
                                </div>

                                <MultiSelect
                                    options={courseOptions}
                                    value={appliesTo}
                                    onChange={(e) => setAppliesTo(e.value)}
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="Select course(s)"
                                    showSelectAll
                                    filter
                                    display="chip"
                                    className="w-full"
                                    disabled={isSubmitting}
                                    pt={{
                                        root: { className: "bg-gray-700 text-white" }, // 👈 background applied
                                    }}
                                />

                                <textarea
                                    name="notes"
                                    placeholder="Notes (optional)"
                                    defaultValue={editDiscount?.notes || ""}
                                    className="textarea bg-gray-900 textarea-bordered w-full focus:outline-0 focus:border-blue-500 resize-none"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {submitError && (
                                <div className="mt-3 text-red-500 text-sm">{submitError}</div>
                            )}

                            <div className="mt-auto pt-4 flex gap-2">
                                <button
                                    type="submit"
                                    className="btn bg-blue-600 btn-primary w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? editDiscount
                                            ? "Updating..."
                                            : "Creating..."
                                        : editDiscount
                                            ? "Update Discount"
                                            : "Create Discount"}
                                </button>

                            </div>
                        </form>
                    </div>
                </>
            )}

            <button onClick={() => setShowModal(true)} type="submit" className="btn z-50  lg:hidden fixed bottom-2 bg-blue-600 btn-primary w-full" >
                Create New Discount
            </button>
        </div>
    );
}
