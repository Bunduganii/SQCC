"""add shipment fields

Revision ID: 9481458ba61b
Revises: 
Create Date: 2026-09-21 10:26:53.187670

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9481458ba61b'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('shipments', schema=None) as batch_op:
        batch_op.add_column(sa.Column('port_of_entry', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('arrival_date', sa.Date(), nullable=True))
        batch_op.add_column(sa.Column('carrier_info', sa.String(length=150), nullable=True))
        batch_op.add_column(sa.Column('weight', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('description', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('expiry_date', sa.Date(), nullable=True))
        batch_op.add_column(sa.Column('ingredient_list', sa.Text(), nullable=True))


def downgrade():
    with op.batch_alter_table('shipments', schema=None) as batch_op:
        batch_op.drop_column('ingredient_list')
        batch_op.drop_column('expiry_date')
        batch_op.drop_column('description')
        batch_op.drop_column('weight')
        batch_op.drop_column('carrier_info')
        batch_op.drop_column('arrival_date')
        batch_op.drop_column('port_of_entry')