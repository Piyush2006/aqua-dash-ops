import { useState, ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export type FormField =
  | { name: string; label: string; type?: "text" | "number" | "email" | "date"; placeholder?: string; required?: boolean; defaultValue?: string }
  | { name: string; label: string; type: "textarea"; placeholder?: string; required?: boolean; defaultValue?: string }
  | { name: string; label: string; type: "select"; options: string[]; placeholder?: string; required?: boolean; defaultValue?: string };

export function FormDialog({
  trigger,
  title,
  description,
  fields,
  submitLabel = "Create",
  successMessage,
}: {
  trigger: ReactNode;
  title: string;
  description?: string;
  fields: FormField[];
  submitLabel?: string;
  successMessage: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success(successMessage);
            setOpen(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fields.map((f) => (
              <div key={f.name} className="grid gap-1.5">
                <Label htmlFor={f.name}>
                  {f.label}
                  {f.required ? <span className="text-critical"> *</span> : null}
                </Label>
                {f.type === "textarea" ? (
                  <Textarea id={f.name} name={f.name} placeholder={f.placeholder} required={f.required} defaultValue={f.defaultValue} rows={3} />
                ) : f.type === "select" ? (
                  <Select name={f.name} defaultValue={f.defaultValue} required={f.required}>
                    <SelectTrigger id={f.name}>
                      <SelectValue placeholder={f.placeholder ?? `Select ${f.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {f.options.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input id={f.name} name={f.name} type={f.type ?? "text"} placeholder={f.placeholder} required={f.required} defaultValue={f.defaultValue} />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
