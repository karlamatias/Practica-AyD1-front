import Button from "../../atoms/Button";
import AdminLayout from "../../templates/AdminLayout";
import InputText from "../../atoms/InputText";
import { useState, useEffect } from "react";

interface Item {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

export default function AdminInventory() {
    const [items, setItems] = useState<Item[]>([
        { id: 1, name: "Filtro de aceite", quantity: 12, price: 25 },
        { id: 2, name: "Bujía", quantity: 20, price: 10 },
    ]);

    const [newItem, setNewItem] = useState<Omit<Item, "id">>({
        name: "",
        quantity: 0,
        price: 0,
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (editingId !== null) {
            const original = items.find((i) => i.id === editingId);
            setHasChanges(
                original?.name !== newItem.name ||
                original?.quantity !== newItem.quantity ||
                original?.price !== newItem.price
            );
        }
    }, [newItem, editingId, items]);

    const handleAddOrUpdateItem = () => {
        if (!newItem.name || newItem.quantity <= 0 || newItem.price <= 0) return;

        if (editingId !== null) {
            // Actualizar item existente
            setItems(
                items.map((i) => (i.id === editingId ? { ...i, ...newItem } : i))
            );
            setEditingId(null);
        } else {
            // Agregar nuevo item
            const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
            setItems([...items, { id: nextId, ...newItem }]);
        }

        setNewItem({ name: "", quantity: 0, price: 0 });
        setHasChanges(false);
    };

    const handleEditClick = (item: Item) => {
        setEditingId(item.id);
        setNewItem({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        });
    };

    return (
        <AdminLayout>
            <h2 className="text-2xl font-bold mb-4">Inventario de repuestos</h2>

            {/* Formulario */}
            <div className="bg-white p-4 rounded shadow mb-6">
                <h3 className="text-lg font-semibold mb-2">
                    {editingId !== null ? "Editar repuesto" : "Agregar nuevo repuesto"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <InputText
                        label="Nombre"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                    <InputText
                        label="Cantidad"
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                    />
                    <InputText
                        label="Precio"
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                    />
                    <Button
                        onClick={handleAddOrUpdateItem}
                        variant="primary"
                        disabled={editingId !== null && !hasChanges}
                    >
                        {editingId !== null ? "Actualizar" : "Agregar"}
                    </Button>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white p-4 rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Nombre</th>
                            <th className="px-4 py-2 text-left">Cantidad</th>
                            <th className="px-4 py-2 text-left">Precio</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td className="px-4 py-2">{item.name}</td>
                                <td className="px-4 py-2">{item.quantity}</td>
                                <td className="px-4 py-2">${item.price}</td>
                                <td className="px-4 py-2">
                                    <Button
                                        className="bg-yellow-400 hover:bg-yellow-500 text-white"
                                        onClick={() => handleEditClick(item)}
                                    >
                                        Editar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
