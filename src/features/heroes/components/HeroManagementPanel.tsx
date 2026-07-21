"use client";

/* eslint-disable @next/next/no-img-element */
import { FormEvent, useState } from "react";
import type { Hero, HeroFormInput, HeroPriority } from "@/types/hero";
import { createHeroWithApi } from "../lib/heroApi";

type HeroManagementPanelProps = {
  heroes: Hero[];
  onHeroesChange: (heroes: Hero[]) => void;
};

const emptyForm: HeroFormInput = {
  imageLandscapeUrl: "",
  imageSquareUrl: "",
  name: "",
  priority: "flex",
  role: "",
};

export function HeroManagementPanel({
  heroes,
  onHeroesChange,
}: HeroManagementPanelProps) {
  const [form, setForm] = useState<HeroFormInput>(emptyForm);
  const [message, setMessage] = useState("");

  const updateForm = (key: keyof HeroFormInput, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: key === "priority" ? (value as HeroPriority) : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      onHeroesChange(await createHeroWithApi(form));
      setForm(emptyForm);
      setMessage("เพิ่มตัวละครเข้าคลังแล้ว");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "เพิ่มตัวละครไม่สำเร็จ");
    }
  };

  return (
    <section className="rounded-lg border border-[#d8dbc9] bg-white p-4 shadow-sm">
      <div>
        <h2 className="text-xl font-bold">คลังตัวละคร</h2>
        <p className="mt-1 text-sm text-[#69705a]">
          รูปแนวนอนแนะนำ 1280x720 px และรูปสี่เหลี่ยมจัตุรัสแนะนำ 512x512 px
        </p>
      </div>

      <form className="mt-4 grid gap-3 lg:grid-cols-2" onSubmit={handleSubmit}>
        <TextInput
          label="ชื่อตัวละคร"
          onChange={(value) => updateForm("name", value)}
          placeholder="เช่น Florentino"
          value={form.name}
        />
        <TextInput
          label="ตำแหน่ง"
          onChange={(value) => updateForm("role", value)}
          placeholder="เช่น Dark Slayer"
          value={form.role}
        />
        <label className="block">
          <span className="text-sm font-semibold text-[#42483a]">ประเภทความสำคัญ</span>
          <select
            className="mt-2 h-11 w-full rounded-md border border-[#cdd2bd] bg-white px-3 text-sm"
            onChange={(event) => updateForm("priority", event.target.value)}
            value={form.priority}
          >
            <option value="flex">Flex</option>
            <option value="pick">Pick</option>
            <option value="ban">Ban</option>
          </select>
        </label>
        <TextInput
          label="URL รูปแนวนอน 1280x720"
          onChange={(value) => updateForm("imageLandscapeUrl", value)}
          placeholder="https://..."
          value={form.imageLandscapeUrl}
        />
        <TextInput
          label="URL รูปสี่เหลี่ยมจัตุรัส 512x512"
          onChange={(value) => updateForm("imageSquareUrl", value)}
          placeholder="https://..."
          value={form.imageSquareUrl}
        />
        <div className="flex items-end">
          <button
            className="h-11 w-full rounded-md bg-[#1f3324] px-4 font-semibold text-white hover:bg-[#2f4b36]"
            type="submit"
          >
            เพิ่มตัวละคร
          </button>
        </div>
      </form>

      {message ? (
        <div className="mt-3 rounded-md border border-[#d8dbc9] bg-[#fbfcf5] px-3 py-2 text-sm text-[#42483a]">
          {message}
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {heroes.map((hero) => (
          <article
            className="overflow-hidden rounded-lg border border-[#d8dbc9] bg-[#fbfcf5]"
            key={hero.id}
          >
            <img
              alt={hero.name}
              className="aspect-video w-full object-cover"
              src={hero.imageLandscapeUrl}
            />
            <div className="flex items-center gap-3 p-3">
              <img
                alt={hero.name}
                className="size-14 rounded-md object-cover"
                src={hero.imageSquareUrl}
              />
              <div>
                <h3 className="font-bold">{hero.name}</h3>
                <p className="text-sm text-[#69705a]">
                  {hero.role} / {hero.priority}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TextInput({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#42483a]">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-md border border-[#cdd2bd] px-3 text-sm outline-none focus:border-[#1f3324]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </label>
  );
}
